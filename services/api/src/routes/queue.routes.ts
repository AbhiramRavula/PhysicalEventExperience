import { Router, Request, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';

export const queueRouter = Router();

// MVP In-Memory Queue Store
// Structure: gateId -> array of active queue slots
type QueueSlot = {
  slot_id: string;
  gate_id: string;
  attendee_id: string;
  joined_at: Date;
  window_start: Date;
  window_end: Date;
  status: 'waiting' | 'open' | 'expired' | 'scanned';
};

const gateQueues: Record<string, QueueSlot[]> = {};

/**
 * Helper to get time estimates based on queue depth
 */
const getQueueETA = (queueDepth: number) => {
  const BATCH_SIZE = 50; // users per 5 min window
  const WINDOW_MINS = 5;
  const windowsAhead = Math.floor(queueDepth / BATCH_SIZE);
  const minutesWait = windowsAhead * WINDOW_MINS;
  
  const now = new Date();
  const start = new Date(now.getTime() + minutesWait * 60000);
  const end = new Date(start.getTime() + WINDOW_MINS * 60000);
  
  return { start, end };
};

/**
 * 1. POST /api/queue/join
 * Join virtual gate queue
 */
queueRouter.post('/join', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const { gate_id, event_id } = req.body;
  const attendeeId = req.user?.attendee_id;

  if (!gate_id || !event_id) {
    return res.status(400).json({ error: 'gate_id and event_id are required.' });
  }

  if (!gateQueues[gate_id]) {
    gateQueues[gate_id] = [];
  }

  // Check if user is already in a queue
  const existingSlot = gateQueues[gate_id].find(q => q.attendee_id === attendeeId && ['waiting', 'open'].includes(q.status));
  if (existingSlot) {
    return res.status(409).json({ error: 'Already in queue for this gate.' });
  }

  const queueDepth = gateQueues[gate_id].length;
  const { start, end } = getQueueETA(queueDepth);

  const newSlot: QueueSlot = {
    slot_id: crypto.randomBytes(8).toString('hex'),
    gate_id,
    attendee_id: attendeeId!,
    joined_at: new Date(),
    window_start: start,
    window_end: end,
    status: 'waiting'
  };

  gateQueues[gate_id].push(newSlot);

  return res.status(201).json({
    message: 'Successfully joined queue',
    slot_id: newSlot.slot_id,
    window_start: newSlot.window_start,
    window_end: newSlot.window_end,
    queue_position: queueDepth + 1,
  });
});

/**
 * 2. GET /api/queue/status
 * Get position and ETA for attendee's active slot
 */
queueRouter.get('/status', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const attendeeId = req.user?.attendee_id;

  // Search through all queues for this attendee's active slot
  let activeSlot: QueueSlot | null = null;
  let queuePos = 0;

  for (const gateId in gateQueues) {
    const queue = gateQueues[gateId];
    const index = queue.findIndex(q => q.attendee_id === attendeeId && ['waiting', 'open'].includes(q.status));
    
    if (index !== -1) {
      activeSlot = queue[index];
      queuePos = index + 1; // 1-indexed position
      break;
    }
  }

  if (!activeSlot) {
    return res.status(404).json({ error: 'No active queue slot found.' });
  }

  const now = new Date();
  if (now > activeSlot.window_end) {
    activeSlot.status = 'expired';
  } else if (now >= activeSlot.window_start && now <= activeSlot.window_end) {
    activeSlot.status = 'open';
  }

  // Generate mock QR payload if window is open
  let qr_payload = null;
  if (activeSlot.status === 'open') {
    qr_payload = Buffer.from(JSON.stringify({ 
      slot_id: activeSlot.slot_id, 
      attendee_id: activeSlot.attendee_id, 
      gate_id: activeSlot.gate_id 
    })).toString('base64');
  }

  return res.json({
    slot_id: activeSlot.slot_id,
    gate_id: activeSlot.gate_id,
    status: activeSlot.status,
    queue_position: queuePos,
    window_start: activeSlot.window_start,
    window_end: activeSlot.window_end,
    qr_payload,
  });
});

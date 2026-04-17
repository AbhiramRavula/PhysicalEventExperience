import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'stadiumiq-super-secret-key-hs256';

// MVP: Mock Database of valid tickets
const MOCK_VALID_TICKETS = [
  'TKT-1111-AAAA',
  'TKT-2222-BBBB',
  'TKT-3333-CCCC',
];

authRouter.post('/login', (req: Request, res: Response) => {
  const { barcode, device_id } = req.body;

  if (!barcode) {
    return res.status(400).json({ error: 'Barcode is required.' });
  }

  // 1. Validate against mock/ticketing system
  if (!MOCK_VALID_TICKETS.includes(barcode)) {
    return res.status(401).json({ error: 'INVALID_TICKET' });
  }

  // 2. Generate token (simulating what Identity-SVC does)
  const attendeePayload = {
    attendee_id: `user_${barcode.substring(4)}`,
    device_id: device_id || 'unknown',
    role: 'attendee',
    seat_zone: 'zone-stand-l', // hardcoded for MVP route to Lower Stand East
  };

  const access_token = jwt.sign(attendeePayload, JWT_SECRET, { expiresIn: '8h' });

  // Note: PRD mentions refresh_token, keeping it simple for MVP
  return res.json({ access_token, attendee_id: attendeePayload.attendee_id });
});

authRouter.get('/me', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  // Returns the profile of the currently authenticated attendee
  return res.json({ profile: req.user });
});

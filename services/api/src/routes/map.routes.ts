import { Router, Request, Response } from 'express';
import { EventEmitter } from 'events';

export const mapRouter = Router();

// Internal global event emitter to replace Kafka for MVP
export const telemetryBus = new EventEmitter();

// --- MOCK DATA FOR MVP ---
// Representing Rajiv Gandhi International Stadium zones defined in PRD
const MOCK_ZONES = [
  { id: 'zone-gate-a', name: 'Gate A — Main Entry', type: 'gate', neighbors: ['zone-conc-n', 'zone-conc-s'] },
  { id: 'zone-conc-n', name: 'North Concourse', type: 'concourse', neighbors: ['zone-gate-a', 'zone-stand-l', 'zone-rest-n'] },
  { id: 'zone-conc-s', name: 'South Concourse', type: 'concourse', neighbors: ['zone-gate-a', 'zone-stand-u', 'zone-food-1'] },
  { id: 'zone-stand-l', name: 'Lower Stand — East', type: 'stand', neighbors: ['zone-conc-n'] },
  { id: 'zone-stand-u', name: 'Upper Stand — West', type: 'stand', neighbors: ['zone-conc-s'] },
  { id: 'zone-rest-n', name: 'Restrooms — North', type: 'restroom', neighbors: ['zone-conc-n'] },
  { id: 'zone-food-1', name: 'Food Court — Level 1', type: 'concession', neighbors: ['zone-conc-s'] },
];

/**
 * 1. GET /api/venues/:id/map
 * Delivers stadium GeoJSON logic for the Mapbox renderer
 */
mapRouter.get('/:id/map', (req: Request, res: Response) => {
  // We mock the GeoJSON FeatureCollection delivery
  return res.json({
    type: 'FeatureCollection',
    features: MOCK_ZONES.map((zone, index) => ({
      type: 'Feature',
      id: zone.id,
      properties: { name: zone.name, type: zone.type },
      geometry: {
        type: 'Polygon',
        // Mocking rough coordinates relative to a center point
        coordinates: [[
          [78.5524 + (index * 0.0001), 17.3986 + (index * 0.0001)],
          [78.5526 + (index * 0.0001), 17.3986 + (index * 0.0001)],
          [78.5526 + (index * 0.0001), 17.3988 + (index * 0.0001)],
          [78.5524 + (index * 0.0001), 17.3988 + (index * 0.0001)],
          [78.5524 + (index * 0.0001), 17.3986 + (index * 0.0001)]
        ]]
      }
    }))
  });
});

/**
 * 2. POST /api/venues/:id/route  (Dijkstra Algorithm)
 * Expects { from_zone: 'zone-gate-a', to_zone: 'zone-stand-l' }
 */
mapRouter.post('/:id/route', (req: Request, res: Response) => {
  const { from_zone, to_zone } = req.body;

  if (!from_zone || !to_zone) {
    return res.status(400).json({ error: 'from_zone and to_zone are required.' });
  }

  // --- Dijkstra Algorithm over MOCK_ZONES ---
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  MOCK_ZONES.forEach((z) => {
    distances[z.id] = Infinity;
    previous[z.id] = null;
    unvisited.add(z.id);
  });
  distances[from_zone] = 0;

  while (unvisited.size > 0) {
    // get node with smallest distance
    let current: string | null = null;
    unvisited.forEach((node) => {
      if (!current || distances[node] < distances[current!]) current = node;
    });

    if (!current || distances[current] === Infinity) break;
    if (current === to_zone) break;

    unvisited.delete(current);

    const zoneObj = MOCK_ZONES.find((z) => z.id === current);
    zoneObj?.neighbors.forEach((neighbor) => {
      if (unvisited.has(neighbor)) {
        const alt = distances[current!] + 1; // 1 represents edge weight distance
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
        }
      }
    });
  }

  const path: string[] = [];
  let currStep: string | null = to_zone;
  
  if (previous[to_zone] || to_zone === from_zone) {
    while (currStep) {
      path.unshift(currStep);
      currStep = previous[currStep];
    }
  }

  if (path.length === 0) {
    return res.status(404).json({ error: 'No path found.' });
  }

  return res.json({ route: path, total_steps: path.length - 1 });
});

/**
 * 3. GET /api/venues/:id/heatmap (SSE Streaming)
 * Uses EventEmitter to flush continuous updates matching our Node.js simulator logic
 */
mapRouter.get('/:id/heatmap', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send an initial heartbeat
  res.write(`data: ${JSON.stringify({ type: 'connected', ts: new Date().toISOString() })}\n\n`);

  const onUpdate = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  telemetryBus.on('zone_density_update', onUpdate);

  // Handle client disconnects to clean up listeners
  req.on('close', () => {
    telemetryBus.off('zone_density_update', onUpdate);
  });
});

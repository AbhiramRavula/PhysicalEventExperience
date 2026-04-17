import { Router, Request, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';

export const orderRouter = Router();

/**
 * 1. GET /api/orders/menu/:venue_id
 * Returns the products menu for a venue.
 */
orderRouter.get('/menu/:venue_id', async (req: Request, res: Response) => {
  const venue_id = req.params.venue_id as string;
  
  try {
    const products = await prisma.product.findMany({
      where: { venueId: venue_id },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    return res.json({ products });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

/**
 * 2. POST /api/orders
 * Create an order (F&B / Merch)
 * Body: { event_id: string, pickup_zone_id: string, items: { product_id: string, quantity: number }[] }
 */
orderRouter.post('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const attendeeId = req.user?.attendee_id;
  const { event_id, pickup_zone_id, items } = req.body;

  if (!event_id || !pickup_zone_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'event_id, pickup_zone_id, and items array are required.' });
  }

  try {
    // 1. Calculate price and stock manually
    let totalAmount = 0;
    const orderItemsToCreate = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.product_id } });
      if (!product || !product.available) {
        return res.status(400).json({ error: `Product ${item.product_id} is largely unavailable.` });
      }

      totalAmount += product.price * item.quantity;
      orderItemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    // MVP Note: We are mocking the payment process here.
    // In a full environment, we would trigger Stripe here.

    // 2. Create the order
    const order = await prisma.order.create({
      data: {
        attendeeId: attendeeId!,
        eventId: event_id,
        status: 'pending', // could be immediate 'confirmed' due to mock payments
        pickupZoneId: pickup_zone_id,
        totalAmount,
        currency: 'INR',
        paymentRef: `MOCK_PAY_${Date.now()}`,
        items: {
          create: orderItemsToCreate
        }
      },
      include: {
        items: true
      }
    });

    // 3. (Optional) Simulate WS Emit to Kitchen Display
    // req.app.get('telemetryBus').emit('new_order', order);

    return res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * 3. GET /api/orders/:id
 * Get order status
 */
orderRouter.get('/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const attendeeId = req.user?.attendee_id;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.attendeeId !== attendeeId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
});

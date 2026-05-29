import Helpdesk from '../models/Helpdesk.js';

const VALID_STATUS = ['open', 'in_progress', 'done'];

/** POST /api/helpdesk — public ticket submission */
export const createTicket = async (req, res) => {
  const { name, email, message } = req.body;
  const ticket = await Helpdesk.create({ name, email, message, status: 'open' });
  res.status(201).json(ticket);
};

/** GET /api/admin/helpdesk */
export const getAllTickets = async (_req, res) => {
  const tickets = await Helpdesk.find().sort({ createdAt: -1 });
  res.json(tickets);
};

/** PATCH /api/admin/helpdesk/:id */
export const updateTicketStatus = async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUS.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const ticket = await Helpdesk.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

  ticket.status = status;
  await ticket.save();
  res.json(ticket);
};

const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

// Gets current user's tickets (private) 'GET /api/tickets'
const getTickets = asyncHandler(async (req, res) => {
  // Get user using its id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const tickets = await Ticket.find({ user: req.user.id });

  res.status(200).json(tickets);
});

// Gets current user ticket by id (private) 'GET /api/tickets/:id'
const getTicketById = asyncHandler(async (req, res) => {
  // Get user using its id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.status(200).json(ticket);
});

// Creates new ticket (private) 'POST /api/tickets'
const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body;

  if (!product || !description) {
    res.status(400);
    throw new Error("Please add a product and description");
  }

  // Get user using its id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: "new",
  });

  res.status(201).json(ticket);
});

// Deletes current user ticket by id (private) 'DELETE /api/tickets/:id'
const deleteTicketById = asyncHandler(async (req, res) => {
  // Get user using its id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await ticket.remove();

  res.status(200).json({ success: true });
});

// Updates current user ticket by id (private) 'PUT /api/tickets/:id'
const updateTicketById = asyncHandler(async (req, res) => {
  // Get user using its id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedTicket);
});

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  deleteTicketById,
  updateTicketById,
};

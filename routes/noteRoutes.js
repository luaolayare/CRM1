const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getNotes, addNote } = require("../controllers/noteController");

const router = express.Router({ mergeParams: true });

// /api/tickets/:ticketId/notes
router.route("/").get(protect, getNotes).post(protect, addNote);

module.exports = router;

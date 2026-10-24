const Workshop = require('../models/Workshop');
const WorkshopBooking = require('../models/WorkshopBooking');

// @desc    Get all workshops
// @route   GET /api/workshops
const getWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find({});
    res.json({ success: true, workshops });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a workshop
// @route   POST /api/workshops/book
const bookWorkshop = async (req, res, next) => {
  try {
    const { workshopId, userName, userEmail, userPhone, tickets = 1 } = req.body;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    if (workshop.seatsLeft < tickets) {
      return res.status(400).json({ success: false, message: `Only ${workshop.seatsLeft} seats left` });
    }

    const totalPrice = workshop.price * tickets;

    const booking = await WorkshopBooking.create({
      workshopId,
      userName,
      userEmail,
      userPhone,
      tickets,
      totalPrice
    });

    // Deduct seats
    workshop.seatsLeft -= tickets;
    await workshop.save();

    res.status(201).json({
      success: true,
      booking,
      workshopTitle: workshop.title
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWorkshops, bookWorkshop };

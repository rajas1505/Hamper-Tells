const mongoose = require('mongoose');

const WorkshopBookingSchema = new mongoose.Schema({
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  tickets: { type: Number, required: true, default: 1 },
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkshopBooking', WorkshopBookingSchema);

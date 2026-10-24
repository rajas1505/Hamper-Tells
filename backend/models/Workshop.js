const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  includes: [{ type: String }],
  seatsLeft: { type: Number, default: 15 }
});

module.exports = mongoose.model('Workshop', WorkshopSchema);

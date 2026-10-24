const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Raw Materials',
      'Packaging & Ribbons',
      'Logistics & Courier',
      'Damaged & Wastage Loss',
      'Operational & Utilities',
      'Marketing & Ads',
      'Other Expenses'
    ],
    default: 'Raw Materials'
  },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  month: { type: String, required: true }, // Format: YYYY-MM
  notes: { type: String, default: '' },
  recordedBy: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

ExpenseSchema.index({ date: -1, month: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);

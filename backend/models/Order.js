const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  giftMessage: { type: String, default: '' },
  customizationDetails: { type: String, default: '' }
});

const CustomHamperSchema = new mongoose.Schema({
  baseBox: {
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  packagingTheme: {
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  greetingCard: {
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  personalMessage: { type: String, default: '' },
  totalPrice: { type: Number, required: true }
});

const TimelineEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  label: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [OrderItemSchema],
  customHamper: { type: CustomHamperSchema, default: null },
  address: {
    houseNo: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true }
  },
  deliveryDate: { type: String, required: true },
  deliveryInstructions: { type: String, default: '' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 99 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD', 'ONLINE_DEMO', 'RAZORPAY', 'UPI_QR'], default: 'COD' },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'COD_ACCEPTED', 'FAILED'], default: 'PENDING' },
  orderStatus: { 
    type: String, 
    enum: ['Order Placed', 'Confirmed', 'Preparing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Order Placed' 
  },
  timeline: [TimelineEventSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);

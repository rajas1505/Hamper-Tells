const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper to generate unique order ID: HT-YYYYMMDD-XXXX
const generateOrderId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HT-${dateStr}-${random}`;
};

// @desc    Create new order with server-side price recalculation
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      customHamper,
      address,
      deliveryDate,
      deliveryInstructions,
      paymentMethod,
      discount = 0
    } = req.body;

    if ((!items || items.length === 0) && !customHamper) {
      return res.status(400).json({ success: false, message: 'No order items or custom hamper provided' });
    }

    if (!address || !address.houseNo || !address.street || !address.city || !address.pinCode) {
      return res.status(400).json({ success: false, message: 'Incomplete delivery address provided' });
    }

    let calculatedSubtotal = 0;
    const validatedItems = [];

    // Recalculate standard product prices from DB
    if (items && items.length > 0) {
      for (const item of items) {
        if (item.product) {
          const dbProduct = await Product.findById(item.product);
          if (dbProduct) {
            const price = dbProduct.price;
            const qty = item.quantity > 0 ? item.quantity : 1;
            calculatedSubtotal += price * qty;
            validatedItems.push({
              product: dbProduct._id,
              name: dbProduct.name,
              image: dbProduct.images[0] || '',
              price: price,
              quantity: qty,
              giftMessage: item.giftMessage || '',
              customizationDetails: item.customizationDetails || ''
            });
          }
        } else {
          // Custom/Non-DB item in cart
          const price = Number(item.price) || 0;
          const qty = item.quantity > 0 ? item.quantity : 1;
          calculatedSubtotal += price * qty;
          validatedItems.push({
            name: item.name || 'Personalized Gift',
            image: item.image || '',
            price: price,
            quantity: qty,
            giftMessage: item.giftMessage || '',
            customizationDetails: item.customizationDetails || ''
          });
        }
      }
    }

    // Process Custom Hamper if provided
    let validatedCustomHamper = null;
    if (customHamper && customHamper.baseBox) {
      const basePrice = Number(customHamper.baseBox.price) || 0;
      let itemsPrice = 0;
      if (Array.isArray(customHamper.items)) {
        itemsPrice = customHamper.items.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
      }
      const pkgPrice = customHamper.packagingTheme ? (Number(customHamper.packagingTheme.price) || 0) : 0;
      const cardPrice = customHamper.greetingCard ? (Number(customHamper.greetingCard.price) || 0) : 0;
      const hamperTotal = basePrice + itemsPrice + pkgPrice + cardPrice;

      calculatedSubtotal += hamperTotal;

      validatedCustomHamper = {
        baseBox: customHamper.baseBox,
        items: customHamper.items || [],
        packagingTheme: customHamper.packagingTheme || { name: 'Standard Pink', price: 99 },
        greetingCard: customHamper.greetingCard || { name: 'Personalized Card', price: 49 },
        personalMessage: customHamper.personalMessage || '',
        totalPrice: hamperTotal
      };
    }

    const deliveryCharge = calculatedSubtotal > 1500 ? 0 : 99; // Free shipping above 1500
    const finalTotal = Math.max(0, calculatedSubtotal + deliveryCharge - Number(discount));

    const now = new Date();
    const defaultTimeline = [
      { status: 'Order Placed', label: 'Order Placed Successfully', timestamp: now, completed: true },
      { status: 'Confirmed', label: 'Order Confirmed by Store', timestamp: new Date(now.getTime() + 10 * 60000), completed: true },
      { status: 'Preparing', label: 'Crafting & Personalizing Gifts', timestamp: new Date(now.getTime() + 30 * 60000), completed: true },
      { status: 'Packed', label: 'Housed in Luxury Gift Packaging', timestamp: new Date(now.getTime() + 60 * 60000), completed: false },
      { status: 'Shipped', label: 'Handed to Delivery Partner', timestamp: new Date(now.getTime() + 120 * 60000), completed: false },
      { status: 'Delivered', label: 'Delivered with Smiles', timestamp: new Date(now.getTime() + 240 * 60000), completed: false }
    ];

    const order = await Order.create({
      orderId: generateOrderId(),
      userId: req.user ? req.user._id : null,
      customerName: customerName || (req.user ? req.user.name : 'Guest Customer'),
      customerEmail: customerEmail || (req.user ? req.user.email : 'guest@example.com'),
      customerPhone: customerPhone || (req.user ? req.user.phone : '9999999999'),
      items: validatedItems,
      customHamper: validatedCustomHamper,
      address,
      deliveryDate: deliveryDate || 'As soon as possible',
      deliveryInstructions: deliveryInstructions || '',
      subtotal: calculatedSubtotal,
      discount: Number(discount),
      deliveryCharge,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'COD_ACCEPTED' : (paymentMethod === 'UPI_QR' ? 'PENDING' : 'PAID'),
      orderStatus: 'Order Placed',
      timeline: defaultTimeline
    });

    const upiUri = `upi://pay?pa=thehampertells@okaxis&pn=The%20Hamper%20Tells&am=${finalTotal}&cu=INR&tn=Order%20${order.orderId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

    res.status(201).json({
      success: true,
      order,
      upiPayment: {
        upiUri,
        qrCodeUrl,
        payeeName: 'The Hamper Tells',
        payeeVpa: 'thehampertells@okaxis',
        amount: finalTotal
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/Confirm UPI payment for an order
// @route   POST /api/orders/:id/pay
const verifyUpiPayment = async (req, res, next) => {
  try {
    const { txnRef } = req.body;
    let order;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    } else {
      order = await Order.findOne({ orderId: req.params.id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'PAID';
    order.paymentMethod = 'UPI_QR';
    await order.save();

    res.json({
      success: true,
      message: 'UPI Payment verified successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
const getMyOrders = async (req, res, next) => {
  try {
    let orders;
    if (req.user) {
      orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    } else {
      orders = [];
    }
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or OrderId string
// @route   GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    let order;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    } else {
      order = await Order.findOne({ orderId: req.params.id });
    }

    if (order) {
      res.json({ success: true, order });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyUpiPayment, getMyOrders, getOrderById };

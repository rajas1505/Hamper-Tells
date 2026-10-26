const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Expense = require('../models/Expense');

// Helper to format Month (YYYY-MM to "MMM YYYY")
const formatMonthLabel = (yyyyMm) => {
  const [year, month] = yyyyMm.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
};

// @desc    Get complete admin dashboard analytics (Revenue, Loss, Monthly Sales, Net Profit)
// @route   GET /api/admin/analytics
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    const expenses = await Expense.find({}).sort({ date: -1 });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({});

    // Filter valid (non-cancelled) orders for revenue
    const validOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
    const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled');

    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalCancelledLoss = cancelledOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalRecordedExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalLossAndCost = totalRecordedExpenses + (totalCancelledLoss * 0.3); // estimated packaging/prep loss on cancellations

    const netProfit = totalRevenue - totalRecordedExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

    // Monthly aggregation
    const monthlyMap = {};

    // Initialize map from orders
    orders.forEach(order => {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          monthKey: key,
          label: formatMonthLabel(key),
          revenue: 0,
          ordersCount: 0,
          cancelledCount: 0,
          expenses: 0,
          netProfit: 0
        };
      }
      if (order.orderStatus !== 'Cancelled') {
        monthlyMap[key].revenue += (order.totalAmount || 0);
        monthlyMap[key].ordersCount += 1;
      } else {
        monthlyMap[key].cancelledCount += 1;
      }
    });

    // Merge expenses into monthly map
    expenses.forEach(exp => {
      const key = exp.month || `${new Date(exp.date).getFullYear()}-${String(new Date(exp.date).getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          monthKey: key,
          label: formatMonthLabel(key),
          revenue: 0,
          ordersCount: 0,
          cancelledCount: 0,
          expenses: 0,
          netProfit: 0
        };
      }
      monthlyMap[key].expenses += (exp.amount || 0);
    });

    // Calculate net profits per month & sort chronologically
    const monthlyData = Object.values(monthlyMap)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .map(item => ({
        ...item,
        netProfit: item.revenue - item.expenses,
        profitMargin: item.revenue > 0 ? (((item.revenue - item.expenses) / item.revenue) * 100).toFixed(1) : 0
      }));

    // Status distribution
    const statusCounts = {
      'Order Placed': 0,
      'Confirmed': 0,
      'Preparing': 0,
      'Packed': 0,
      'Shipped': 0,
      'Delivered': 0,
      'Cancelled': 0
    };
    orders.forEach(o => {
      if (statusCounts[o.orderStatus] !== undefined) {
        statusCounts[o.orderStatus]++;
      } else {
        statusCounts[o.orderStatus] = 1;
      }
    });

    // Category sales aggregation
    const categorySales = {};
    orders.forEach(o => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach(item => {
          const cat = 'Curated Gifts & Bouquets';
          categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
        });
      }
      if (o.customHamper) {
        categorySales['Custom Hampers'] = (categorySales['Custom Hampers'] || 0) + (o.customHamper.totalPrice || 0);
      }
    });

    // Expense categories aggregation
    const expenseByCategory = {};
    expenses.forEach(e => {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
    });

    const metricsObj = {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers,
      totalProducts,
      totalExpenses: totalRecordedExpenses,
      totalLossAndCost,
      netProfit,
      profitMargin: Number(profitMargin),
      cancelledOrdersCount: cancelledOrders.length
    };

    res.json({
      success: true,
      metrics: metricsObj,
      kpis: metricsObj,
      monthlyData,
      monthlyFinancials: monthlyData,
      statusCounts,
      categorySales,
      expenseByCategory,
      recentOrders: orders.slice(0, 5),
      recentExpenses: expenses.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderId: searchRegex },
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { customerPhone: searchRegex }
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const orderStatus = req.body.orderStatus || req.body.status;
    const note = req.body.note;
    let order;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    } else {
      order = await Order.findOne({ orderId: req.params.id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    // Update timeline stages
    const stages = ['Order Placed', 'Confirmed', 'Preparing', 'Packed', 'Shipped', 'Delivered'];
    const currentIdx = stages.indexOf(order.orderStatus);

    if (order.timeline && order.timeline.length > 0) {
      order.timeline.forEach((item, idx) => {
        if (currentIdx !== -1 && idx <= currentIdx) {
          item.completed = true;
        } else if (orderStatus === 'Cancelled') {
          // keep as is
        }
      });
    }

    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'PAID';
    } else if (orderStatus === 'Cancelled') {
      // Add cancellation event
      order.timeline.push({
        status: 'Cancelled',
        label: note || 'Order was cancelled by store / customer',
        timestamp: new Date(),
        completed: true
      });
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to "${orderStatus}"`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers with their total orders & spend
// @route   GET /api/admin/customers
const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-passwordHash').sort({ createdAt: -1 });

    // Aggregate orders for each customer
    const customersWithStats = await Promise.all(customers.map(async (customer) => {
      const orders = await Order.find({
        $or: [
          { userId: customer._id },
          { customerEmail: customer.email.toLowerCase() }
        ]
      });

      const totalSpent = orders
        .filter(o => o.orderStatus !== 'Cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
        createdAt: customer.createdAt,
        totalOrders: orders.length,
        totalSpent,
        lastOrderDate: orders.length > 0 ? orders[0].createdAt : null,
        recentOrders: orders.slice(0, 3).map(o => ({
          orderId: o.orderId,
          totalAmount: o.totalAmount,
          orderStatus: o.orderStatus,
          createdAt: o.createdAt
        }))
      };
    }));

    res.json({
      success: true,
      count: customersWithStats.length,
      customers: customersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recorded expenses & losses
// @route   GET /api/admin/expenses
const getExpenses = async (req, res, next) => {
  try {
    const { month } = req.query;
    let query = {};
    if (month) {
      query.month = month;
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      count: expenses.length,
      totalAmount,
      expenses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a new business expense or loss
// @route   POST /api/admin/expenses
const createExpense = async (req, res, next) => {
  try {
    const { title, category, amount, date, notes } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ success: false, message: 'Title and amount are required' });
    }

    const expenseDate = date ? new Date(date) : new Date();
    const month = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;

    const expense = await Expense.create({
      title,
      category: category || 'Raw Materials',
      amount: Number(amount),
      date: expenseDate,
      month,
      notes: notes || '',
      recordedBy: req.user ? req.user.name : 'Store Admin'
    });

    res.status(201).json({
      success: true,
      message: 'Expense / loss record created successfully',
      expense
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/admin/expenses/:id
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }
    res.json({ success: true, message: 'Expense record deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/admin/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, occasion, images, stock, isFeatured, isBestSeller, customizable, includedItems } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Product name, price, and category are required' });
    }

    const product = await Product.create({
      name,
      description: description || 'Handcrafted luxury gift creation from The Hamper Tells.',
      price: Number(price),
      category,
      occasion: occasion || 'All',
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'],
      stock: Number(stock) || 20,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      customizable: Boolean(customizable),
      includedItems: Array.isArray(includedItems) ? includedItems : []
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getExpenses,
  createExpense,
  deleteExpense,
  createProduct,
  deleteProduct
};

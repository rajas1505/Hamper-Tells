const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'the_hamper_tells_super_secret_jwt_key_2026_viva', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role || 'customer',
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token (General login)
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role || 'customer',
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Admin specific login
// @route   POST /api/auth/admin-login
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide admin email and password' });
    }

    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Access denied: Not an authorized admin account' });
    }

    if (await user.matchPassword(password)) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Customer Entry / Welcome gate (instant register or sign-in)
// @route   POST /api/auth/customer-entry
const customerEntry = async (req, res, next) => {
  try {
    let { name, email, phone, city } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide name and phone number' });
    }

    name = name.trim();
    phone = phone.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!email || !email.trim()) {
      email = `customer_${cleanPhone || Date.now()}@customer.thehampertells.com`;
    } else {
      email = email.trim().toLowerCase();
    }

    let user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        phone,
        passwordHash: 'Customer@123',
        role: 'customer',
        addresses: city ? [{
          houseNo: 'Flat 101',
          street: 'Main Road',
          city: city.trim(),
          state: 'Karnataka',
          pinCode: '590001',
          isDefault: true
        }] : [{
          houseNo: 'House 1',
          street: 'College Road',
          city: 'Belagavi',
          state: 'Karnataka',
          pinCode: '590001',
          isDefault: true
        }]
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'customer',
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, loginAdmin, customerEntry, getUserProfile };

import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';

const JWT_SECRET = env.JWT_SECRET || 'csc-center-super-secret-jwt-key-development-2026';

/**
 * Authentication Middleware
 * Reads Bearer token, verifies identity via JWT or Supabase Auth,
 * checks account activation status, and attaches req.user = { id, email, role, fullName, mobile }.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];

    // 1. First attempt to decode JWT token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.id) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role || 'customer',
          fullName: decoded.fullName || 'User',
          mobile: decoded.mobile || ''
        };
        return next();
      }
    } catch (jwtErr) {
      // If not a local JWT, continue to verify with Supabase
    }

    // 2. Verify token with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData || !authData.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid, expired, or revoked authentication session.'
      });
    }

    const authUserId = authData.user.id;
    const authEmail = authData.user.email;

    // 3. Fetch application user profile from users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, full_name, email, mobile, role, is_active')
      .eq('id', authUserId)
      .single();

    if (profileError || !userProfile) {
      req.user = {
        id: authUserId,
        email: authEmail,
        role: authEmail === 'admin@csccenter.in' || authEmail === 'princesinghara4@gmail.com' ? 'admin' : 'customer',
        fullName: authData.user.user_metadata?.full_name || 'Customer',
        mobile: authData.user.user_metadata?.mobile || ''
      };
      return next();
    }

    if (userProfile.is_active === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Please contact support.'
      });
    }

    req.user = {
      id: userProfile.id,
      email: userProfile.email || authEmail,
      role: userProfile.role || (userProfile.email === 'admin@csccenter.in' || userProfile.email === 'princesinghara4@gmail.com' ? 'admin' : 'customer'),
      fullName: userProfile.full_name,
      mobile: userProfile.mobile
    };

    next();
  } catch (error) {
    console.error('[authMiddleware] Authentication exception:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication verification failed.'
    });
  }
};

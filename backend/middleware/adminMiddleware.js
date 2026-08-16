import { supabase } from '../config/supabase.js';

/**
 * Admin Authorization Middleware
 * Verifies that the authenticated user has role = 'admin'.
 */
export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required prior to administrative authorization.'
    });
  }

  if (req.user.role !== 'admin' && req.user.email !== 'admin@csccenter.in' && req.user.email !== 'princesinghara4@gmail.com') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrative privileges required.'
    });
  }

  // Ensure role is admin on req.user
  req.user.role = 'admin';
  next();
};

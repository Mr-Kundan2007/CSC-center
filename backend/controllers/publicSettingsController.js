import asyncHandler from '../middleware/asyncHandler.js';

// Centralized Allowlisted Public Business Settings
const publicSettings = {
  centerName: 'Maa Vindhyawasini Online Centre',
  phone: '+91 9155098378',
  email: 'princesinghara4@gmail.com',
  address: 'Power Ganj New Over Bridge, Sawita Surya Mandir, Ara, Bihar',
  workingHours: 'Mon - Sat: 9:30 AM - 7:00 PM',
  whatsapp: '+91 9155098378'
};

/**
 * GET /api/site-settings/public
 * Exposes Allowlisted Public Center Settings
 */
export const getPublicSettings = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: publicSettings
  });
});

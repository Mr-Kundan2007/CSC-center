import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

// Helper to skip rate limiting in development or localhost
const skipDev = (req) => {
  if (isDev) return true;
  const ip = req.ip || req.connection?.remoteAddress || '';
  return ip === '127.0.0.1' || ip === '::1' || ip.includes('127.0.0.1') || ip === 'localhost';
};

// 1. General API Rate Limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: { success: false, message: 'Too many requests from this IP address. Please try again later.' }
});

// 2. Auth Rate Limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 5000 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: { success: false, message: 'Too many authentication attempts. Please try again after a few minutes.' }
});

// 3. Contact Form Spam Rate Limiter
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: { success: false, message: 'Too many contact messages sent. Please try again later.' }
});

// 4. Payment Order Creation Rate Limiter
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: { success: false, message: 'Payment transaction creation rate limit exceeded. Please try again later.' }
});

// 5. Application Submission Rate Limiter
export const applicationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: { success: false, message: 'Application submission rate limit exceeded. Please try again later.' }
});

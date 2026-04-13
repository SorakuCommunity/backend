import rateLimit from "express-rate-limit";
import helmet from "helmet";

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
  rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
      success: false,
      error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests" },
    },
  }),
];

export default securityMiddleware;

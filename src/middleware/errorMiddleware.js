import { logger } from '../server.js';

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//eslint-disable-next-line
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);
  logger.error({ status: res.statusCode, message: err.message });
  res.json({
    message: err.message,
    status: res.statusCode.toString(),
    errors: err.errors ?? [],
  });
};

export { notFound, errorHandler };

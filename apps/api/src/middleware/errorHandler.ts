import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const status = typeof error.status === "number" ? error.status : 500;
  console.error("API request failed", error);

  response.status(status).json({
    error: {
      message: status === 500 ? "Unexpected server error" : error.message
    }
  });
};

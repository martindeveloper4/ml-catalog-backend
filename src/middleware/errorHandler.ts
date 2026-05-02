import { Request, Response, NextFunction } from 'express';

interface AppError {
  status?: number;
  message?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction): void {
  const status  = err.status  ?? 500;
  const message = err.message ?? 'Internal server error';

  if (status >= 500) {
    console.error('[ERROR]', err);
  }

  res.status(status).json({ message });
}

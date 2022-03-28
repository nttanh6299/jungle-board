import { Request, Response, NextFunction } from 'express'

type Fn = (req: Request, res: Response, next: NextFunction) => any

const catchAsync = (fn: Fn) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err))
}

export default catchAsync

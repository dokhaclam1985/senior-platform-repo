import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';

export function asyncHandler<
  Params = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  handler: (
    req: Request<Params, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<void>
): RequestHandler<Params, ResBody, ReqBody, ReqQuery> {
  return (req, res, next) => {
    Promise.resolve(
      handler(req, res, next)
    ).catch(next);
  };
}
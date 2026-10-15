import { randomUUID } from "crypto";
import {
  Request,
  Response,
  NextFunction,
} from "express";

export function requestId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const incomingRequestId =
    req.header("x-request-id");

  const id =
    incomingRequestId || randomUUID();

  res.locals.requestId = id;

  res.setHeader(
    "x-request-id",
    id
  );

  next();
}
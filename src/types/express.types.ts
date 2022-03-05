import { Request, Response, NextFunction } from 'express';
import * as core from 'express-serve-static-core';


export type Controller<ReqParams, ReqBody, ResBody=null> = (req: Request<ReqParams, ResBody, ReqBody, core.Query>, res: Response<ResBody>, next?: NextFunction) => any



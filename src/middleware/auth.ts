import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization
  if(authToken) {
    jwt.verify(authToken, process.env.JWT_SECRET as string, (err, decoded) => {
      if(err) {
        res.status(403).json({
          msg: "Unauthorized"
        })
      }
      // @ts-ignore
      req.userId = decoded.id
      next()
    })
  } else {
    res.sendStatus(401)
  }
}
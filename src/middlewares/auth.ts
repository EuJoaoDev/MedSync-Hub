import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";

type dataJwt = JwtPayload & { userId: number; roles: string[] };

export const verifyToken = (
  listaPermissoes: string[],
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Request body in verifyToken middleware:", req.body);
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    if (!token) {
      res.status(401).json("Token inválido!");
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;

    req.userId = payload.userId;

    const profile = payload.profile;

    let hasPermission = false;

    if (listaPermissoes.includes(profile)) {
      hasPermission = true;
    }

    if (!hasPermission) {
      res
        .status(401)
        .json({
          message: "Usuário não possui autorização para acessar este recurso!",
        });
      return;
    }

    req.userId = Number(payload.userId);

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 401));
    } else {
      next(new AppError("Unknown error", 401));
    }
  }
};

export default verifyToken;

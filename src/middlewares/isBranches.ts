import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

export const isBranch = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // Pegando apenas o token (Bearer <token>)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any; // Decodifica o token

    if (decoded.profile === "BRANCH") {
      (req as any).userId = decoded.userId; // Adiciona o userId ao objeto req
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "Acesso negado, você não é uma FILIAL" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

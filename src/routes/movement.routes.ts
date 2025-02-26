//ABAIXO FUNCIONAL
import { Router } from "express";
import verifyToken from "../middlewares/auth";
import MovementsController from "../controllers/MovementControllers";
import { Request, Response, NextFunction } from "express";

const movementsRouter = Router();

const movementsControler = new MovementsController();

//@ts-ignore
movementsRouter.post(
  "/",
  (req, res, next) => verifyToken(["BRANCH"], req, res, next),
  movementsControler.createMovements
);
movementsRouter.get(
  "/",
  (req, res, next) => verifyToken(["BRANCH"], req, res, next),
  movementsControler.listMovements
);
//@ts-ignore
movementsRouter.patch(
  "/status/:id",
  (req, res, next) => verifyToken(["DRIVER"], req, res, next),
  movementsControler.updateStatusMovements
);
movementsRouter.patch(
  "/status/:id/end",
  (req, res, next) => verifyToken(["DRIVER"], req, res, next),
  movementsControler.updateStatusEndMovements
);

export default movementsRouter;

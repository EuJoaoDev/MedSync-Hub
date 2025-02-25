// import { Router } from "express";
// import MovementController from "../controllers/MovementControllers";
// import verifyToken from "../middlewares/auth";
// import { isBranch } from "../middlewares/isBranches";

// const movementRouter = Router();

// movementRouter.post("/", verifyToken, isBranch, MovementController.create);

// export default movementRouter;

import { Router } from "express"
import verifyToken from "../middlewares/auth";
import MovementsController from "../controllers/MovementControllers";
import { Request, Response, NextFunction } from "express";

const movementsRouter = Router();

const movementsControler = new MovementsController()


//@ts-ignore
movementsRouter.post("/", (req, res, next) => verifyToken(["BRANCH"], req, res, next), movementsControler.createMovements)
movementsRouter.get("/", (req, res, next) => verifyToken(["BRANCH"], req, res, next), movementsControler.listMovements)

export default movementsRouter;
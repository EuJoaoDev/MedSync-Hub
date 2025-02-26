import { Router } from "express";
import UserController from "../controllers/UserController";
import authRouter from "./auth.routes";
import verifyToken from "../middlewares/auth";

import ProductController from "../controllers/ProductController";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/", userController.create);
userRouter.post("/login", authRouter); // Alterado de .post para .use
userRouter.get(
  "/",
  (req, res, next) => verifyToken(["ADMIN"], req, res, next),
  userController.listaUsuarios
);
userRouter.get(
  "/:id",
  (req, res, next) => verifyToken(["ADMIN", "DRIVER"], req, res, next),
  userController.listUsarioId
);
userRouter.put(
  "/:id",
  (req, res, next) => verifyToken(["ADMIN", "DRIVER"], req, res, next),
  userController.updateUser
);
userRouter.patch(
  "/status/:id",
  (req, res, next) => verifyToken(["ADMIN", "DRIVER"], req, res, next),
  userController.updateStatusUsuario
);

export default userRouter;

// import { Request, Response, NextFunction } from "express";
// import { AppDataSource } from "../data-source";
// import { Movement } from "../entities/Movements";
// import { Product } from "../entities/Products";
// import { Branch } from "../entities/Branches";
// import AppError from "../utils/AppError";

// class MovementController {
//   create = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { destination_branch_id, product_id, quantity } = req.body;
//       const { userId } = req as any;

//       if (!destination_branch_id || !product_id || !quantity) {
//         return next(
//           new AppError(
//             "Todos os campos obrigatórios devem ser preenchidos.",
//             400
//           )
//         );
//       }

//       if (quantity <= 0) {
//         return next(new AppError("A quantidade deve ser maior que 0.", 400));
//       }

//       const branchRepository = AppDataSource.getRepository(Branch);
//       const productRepository = AppDataSource.getRepository(Product);
//       const movementRepository = AppDataSource.getRepository(Movement);

//       const originBranch = await branchRepository.findOne({
//         where: { user: { id: userId } },
//       });

//       if (!originBranch) {
//         return next(new AppError("Filial de origem não encontrada.", 404));
//       }

//       if (originBranch.id === destination_branch_id) {
//         return next(
//           new AppError(
//             "A filial de origem não pode ser a mesma que a filial de destino.",
//             400
//           )
//         );
//       }

//       const product = await productRepository.findOne({
//         where: { id: product_id, branch: originBranch },
//       });

//       if (!product) {
//         return next(
//           new AppError("Produto não encontrado na filial de origem.", 404)
//         );
//       }

//       if (product.amount < quantity) {
//         return next(
//           new AppError("Estoque insuficiente para essa movimentação.", 400)
//         );
//       }

//       product.amount -= quantity;
//       await productRepository.save(product);

//       const movement = movementRepository.create({
//         destination_branch: { id: destination_branch_id },
//         product,
//         quantity,
//       });

//       await movementRepository.save(movement);

//       res.status(201).json({
//         message: "Movimentação cadastrada com sucesso!",
//         movement,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };
// }

// export default new MovementController();


import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Branch } from "../entities/Branches";
import { Product } from "../entities/Products";
import { Movements } from "../entities/Movements";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../entities/User";


type dataJwt = JwtPayload & { userId: number; };

class MovementsController {
    private branchRepository
    private productRepository
    private movementsRepository
    private userRepository

    constructor() {
        this.branchRepository = AppDataSource.getRepository(Branch)
        this.productRepository = AppDataSource.getRepository(Product)
        this.movementsRepository = AppDataSource.getRepository(Movements)
        this.userRepository = AppDataSource.getRepository(User)
    }
    createMovements = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { product_id, destination_branch_id, quantity } = req.body;
            // const token = req.headers.authorization?.split(" ")[1];

            // if (!token) {
            //     return res.status(401).json({ message: "Token inválido" });
            // }

            // const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;

            // Buscar a filial de origem (usuário autenticado)
            const branch = await this.branchRepository.findOne({ where: { id: Number(req.userId) } });

            // Verificar se o perfil é 'BRANCH' e se o userId corresponde à filial
            // if (decoded.profile !== "BRANCH" || Number(decoded.userId) !== branch?.user_id) {
            //     return res.status(403).json({ message: "Acesso negado" });
            // }

            if (!product_id || !destination_branch_id || !quantity) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios" });
            }

            if (quantity <= 0) {
                return res.status(400).json({ message: "A quantidade deve ser maior que zero" });
            }

            // 🔹 Verificar se a filial de destino existe
            const destinationBranch = await this.branchRepository.findOne({ where: { id: Number(destination_branch_id) } });
            if (!destinationBranch) {
                return res.status(404).json({ message: "Filial de destino não encontrada" });
            }

            // 🔹 Verificar se a filial de origem e destino são diferentes
            if (Number(branch?.user_id) === Number(destination_branch_id)) {
                return res.status(400).json({ message: "A filial de origem não pode ser a mesma que a filial de destino" });
            }

            // 🔹 Buscar o produto
            const product = await this.productRepository.findOne({ where: { id: Number(product_id) } });
            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }

            // 🔹 Verificar se a quantidade solicitada está disponível
            if (product.amount < quantity) {
                return res.status(400).json({ message: "Estoque insuficiente para essa movimentação" });
            }

            // 🔹 Criar a movimentação com status PENDING
            const createMovements = await this.movementsRepository.save({
                destination_branch_id,
                product_id,
                quantity,
                status: "PENDING",
            });

            // 🔹 Atualizar a quantidade do produto na filial de origem
            await this.productRepository.update(product.id, { amount: product.amount - quantity });

            return res.status(201).json({
                message: "Movimentação cadastrada com sucesso!",
                movement: {
                    id: createMovements.id,
                    destination_branch_id: createMovements.destination_branch_id,
                    product_id: createMovements.product_id,
                    quantity: createMovements.quantity,
                    status: createMovements.status,
                },
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao processar requisição" });
        }
    }
    listMovements = async (req: Request, res: Response) => {
        try {
            const moviments = await this.movementsRepository.find({})
            res.status(200).json(moviments)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao processar requisição" });
        }

    }
}

export default MovementsController
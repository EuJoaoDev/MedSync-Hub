// import { NextFunction, Request, Response } from "express";
// import { AppDataSource } from "../data-source";
// import { Product } from "../entities/Products";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import logger from "../config/winston";
// import AppError from "../utils/AppError";
// import { Branch } from "../entities/Branches";
// // import { AuthRequest } from "../middlewares/auth";


// type dataJwt = JwtPayload & { userId: number; };


// class ProductController {
//    private branchRepository;
//     private productRepository;

//     constructor() {
//         // this.branchRepository = AppDataSource.getRepository(Branch);
//         this.productRepository = AppDataSource.getRepository(Product);
//         this.branchRepository = AppDataSource.getRepository(Branch);
//     }

//     createProduct = async (req: Request, res: Response, next: NextFunction) => {
//         try {

//             const token = req.headers.authorization?.split(" ")[1];
//             const { name, amount, description, url_cover } = req.body;

//             if (!token) {
//                 res.status(401).json({ message: "Token inválido" });
//                 return

//             }

//             const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;


//             const branch = await this.branchRepository.findOne({ where: { id: Number(req.userId) } });

//             if (!branch) {
//                 res.status(404).json({ message: "Usuário não encontrado" });
//                 return
//             }



//             if (!name || !amount || !description) {
//                 res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
//                 return
//             }

//             if (amount <= 0) {
//                 res.status(400).json({ error: "'amount' deve ser um número positivo." });
//                 return
//             }

//             if (decoded.profile !== "BRANCH") {
//                 res.status(403).json({ error: "Acesso proibido. Apenas filiais podem cadastrar produtos." });
//                 return
//             }

//             // Criando o produto
//             const createdProduct = await this.productRepository.save({
//                 name,
//                 amount,
//                 description,
//                 url_cover,
//                 branch_id: branch.id
//             });

//             console.log("Created product:", createdProduct);

//             res.status(201).json({
//                 message: "Produto cadastrado com sucesso!",
//                 product: {
//                     id: createdProduct.id,
//                     name: createdProduct.name,
//                     amount: createdProduct.amount,
//                     description: createdProduct.description,
//                     url_cover: createdProduct.url_cover
//                 }
//             });
//             return

//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: "Erro ao processar requisição" });
//             return
//         }
//     };

// }

// export default ProductController

import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Products";
import { Branch } from "../entities/Branches";
import AppError from "../utils/AppError";

class ProductController {
  create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { name, amount, description, url_cover } = req.body;
      const { userId } = req as any;

      if (!name || !amount || !description) {
        return next(new AppError("Todos os campos obrigatórios devem ser preenchidos.", 400));
      }

      if (amount <= 0) {
        return next(new AppError("A quantidade deve ser maior que 0.", 400));
      }

      const branchRepository = AppDataSource.getRepository(Branch);
      const productRepository = AppDataSource.getRepository(Product);

      // Buscar a filial vinculada ao usuário
      const branch = await branchRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!branch) {
        return next(new AppError("Filial não encontrada.", 404));
      }

      // Criar e salvar o novo produto
      const product = productRepository.create({
        name,
        amount,
        description,
        url_cover: url_cover || null,
        branch,
      });

      await productRepository.save(product);

      return res.status(201).json({
        message: "Produto cadastrado com sucesso!",
        product,
      });
    } catch (error) {
      next(error);
    }
  
};

list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productRepository = AppDataSource.getRepository(Product);

      const products = await productRepository.find({
        relations: ["branch"],
        select: ["id", "name", "amount", "description", "url_cover", "branch"],
      });

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

}

export default new ProductController();
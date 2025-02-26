import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Products";
import { Branch } from "../entities/Branches";
import AppError from "../utils/AppError";

class ProductController {
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, amount, description, url_cover } = req.body;
      const { userId } = req as any;

      if (!name || !amount || !description) {
        return next(
          new AppError(
            "Todos os campos obrigatórios devem ser preenchidos.",
            400
          )
        );
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

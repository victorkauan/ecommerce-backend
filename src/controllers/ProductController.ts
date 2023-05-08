import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductController {
  async index(req: Request, res: Response) {
    const products = await prisma.product.findMany({
      include: {
        ProductCategory: true,
      },
    });
    return res.status(200).json({ products });
  }

  async create(req: Request, res: Response) {
    const { name, description, price, productCategoryIds } = req.body;

    if (
      !name ||
      !description ||
      (!price && price !== 0) ||
      !productCategoryIds
    ) {
      return res.status(400).json({
        error: 'name, description, price and productCategoryIds are required.',
      });
    }

    const foundCategories = await prisma.productCategory.findMany({
      where: {
        id: {
          in: productCategoryIds,
        },
      },
    });

    if (productCategoryIds.length !== foundCategories.length) {
      return res.status(400).json({
        error: 'One or more product category ID are invalid.',
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        ProductCategory: {
          connect: productCategoryIds.map((id: number) => ({ id })),
        },
      },
    });

    return res.status(201).json({ product });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, price, productCategoryIds } = req.body;

    const foundProduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundProduct) {
      return res.status(404).json({
        error: 'Product not found.',
      });
    }

    if (!name && !description && !price && price !== 0 && !productCategoryIds) {
      return res.status(400).json({
        error:
          'At least one field is required (name, description, price or productCategoryIds).',
      });
    }

    if (productCategoryIds?.length) {
      const foundCategories = await prisma.productCategory.findMany({
        where: {
          id: {
            in: productCategoryIds,
          },
        },
      });

      if (productCategoryIds.length !== foundCategories.length) {
        return res.status(400).json({
          error: 'One or more product category ID are invalid.',
        });
      }
    }

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
        price,
        ProductCategory: {
          set: productCategoryIds?.map((id: number) => ({ id })),
        },
      },
    });

    return res.status(200).json({ product });
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    const foundProduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundProduct) {
      return res.status(404).json({
        error: 'Product not found.',
      });
    }

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(204).send();
  }
}

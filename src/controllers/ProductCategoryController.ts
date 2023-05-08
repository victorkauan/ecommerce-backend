import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductCategoryController {
  async index(req: Request, res: Response) {
    const productCategories = await prisma.productCategory.findMany();
    return res.status(200).json({ productCategories });
  }

  async create(req: Request, res: Response) {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ error: 'name and description are required.' });
    }

    const productCategory = await prisma.productCategory.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json({ productCategory });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;

    const foundProductCategory = await prisma.productCategory.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundProductCategory) {
      return res.status(404).json({ error: 'Product category not found.' });
    }

    if (!name && !description) {
      return res.status(400).json({
        error: 'At least one field is required (name or description).',
      });
    }

    const productCategory = await prisma.productCategory.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json({ productCategory });
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    const foundProductCategory = await prisma.productCategory.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundProductCategory) {
      return res.status(404).json({ error: 'Product category not found.' });
    }

    await prisma.productCategory.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(204).json();
  }
}

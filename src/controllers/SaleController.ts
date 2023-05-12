import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { Order } from '../types/db';

const prisma = new PrismaClient();

export class SaleController {
  async index(req: Request, res: Response) {
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
        orders: true,
      },
    });

    return res.status(200).json(sales);
  }

  async create(req: Request, res: Response) {
    const { customerId, orders } = req.body;

    if (!customerId || !orders) {
      return res.status(400).json({
        error: 'customerId and orders (productId and quantity) are required.',
      });
    }

    const foundCustomer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!foundCustomer) {
      return res.status(404).json({
        error: 'Customer not found.',
      });
    }

    const foundProducts = await prisma.product.findMany({
      where: {
        id: {
          in: orders.map(({ productId }: Order) => productId),
        },
      },
    });

    if (foundProducts.length !== orders.length) {
      return res.status(404).json({
        error: 'Some product was not found.',
      });
    }

    for (const order of orders) {
      if (!order?.productId || (!order?.quantity && order?.quantity !== 0)) {
        return res.status(400).json({
          error: 'productId and quantity are required on all orders.',
        });
      }
    }

    const sale = await prisma.sale.create({
      data: {
        customerId,
      },
    });

    for (const { productId, quantity } of orders) {
      await prisma.order.create({
        data: {
          productId: productId,
          saleId: sale.id,
          quantity,
        },
      });
    }

    const createdSale = await prisma.sale.findUnique({
      where: {
        id: sale.id,
      },
      include: {
        customer: true,
        orders: true,
      },
    });

    return res.status(201).json(createdSale);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { customerId, orders } = req.body;

    const foundSale = await prisma.sale.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundSale) {
      return res.status(404).json({
        error: 'Sale not found.',
      });
    }

    if (!customerId && customerId !== 0 && !orders) {
      return res.status(400).json({
        error: 'At least one field is required (customerId or orders).',
      });
    }

    if (customerId) {
      const foundCustomer = await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

      if (!foundCustomer) {
        return res.status(404).json({
          error: 'Customer not found.',
        });
      }
    }

    if (orders?.length > 0) {
      const foundProducts = await prisma.product.findMany({
        where: {
          id: {
            in: orders.map(({ productId }: Order) => productId),
          },
        },
      });

      if (foundProducts.length !== orders.length) {
        return res.status(404).json({
          error: 'Some product was not found.',
        });
      }

      for (const order of orders) {
        if (!order?.productId || (!order?.quantity && order?.quantity !== 0)) {
          return res.status(400).json({
            error: 'productId and quantity are required on all orders.',
          });
        }
      }

      await prisma.order.deleteMany({
        where: {
          saleId: Number(id),
        },
      });

      for (const { productId, quantity } of orders) {
        await prisma.order.create({
          data: {
            productId: productId,
            saleId: Number(id),
            quantity,
          },
        });
      }
    }

    const sale = await prisma.sale.update({
      data: {
        customerId: customerId ?? foundSale.customerId,
      },
      where: {
        id: Number(id),
      },
    });

    const updatedSale = await prisma.sale.findUnique({
      where: {
        id: sale.id,
      },
      include: {
        customer: true,
        orders: true,
      },
    });

    return res.status(200).json(updatedSale);
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    const foundSale = await prisma.sale.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundSale) {
      return res.status(404).json({
        error: 'Sale not found.',
      });
    }

    await prisma.order.deleteMany({
      where: {
        saleId: Number(id),
      },
    });

    await prisma.sale.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(204).send();
  }
}

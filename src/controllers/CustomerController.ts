import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerController {
  async index(req: Request, res: Response) {
    const customers = await prisma.customer.findMany();
    return res.status(200).json({ customers });
  }

  async create(req: Request, res: Response) {
    const { firstName, lastName, email, phone, birthDate } = req.body;

    if (!firstName || !lastName || !email || !phone || !birthDate) {
      return res.status(400).json({
        error: 'firstName, lastName, email, phone and birthDate are required.',
      });
    }

    const foundCustomer = await prisma.customer.findUnique({
      where: {
        email,
      },
    });

    if (foundCustomer) {
      return res.status(409).json({ error: 'Customer already exists.' });
    }

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        birthDate: new Date(birthDate),
      },
    });

    return res.status(201).json({ customer });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { firstName, lastName, email, phone, birthDate } = req.body;

    const foundCustomer = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundCustomer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    if (!firstName && !lastName && !email && !phone && !birthDate) {
      return res.status(400).json({
        error:
          'At least one field is required (firstName, lastName, email, phone or birthDate).',
      });
    }

    const customer = await prisma.customer.update({
      data: {
        firstName: firstName ?? foundCustomer.firstName,
        lastName: lastName ?? foundCustomer.lastName,
        email: email ?? foundCustomer.email,
        phone: phone ?? foundCustomer.phone,
        birthDate: birthDate ? new Date(birthDate) : foundCustomer.birthDate,
      },
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({ customer });
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    const foundCustomer = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundCustomer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    await prisma.customer.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(204).json();
  }
}

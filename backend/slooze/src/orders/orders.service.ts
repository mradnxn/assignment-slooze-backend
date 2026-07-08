import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../lib/prisma';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  async create(userId: number, createOrderDto: CreateOrderDto) {
    // 1. Verify restaurant exists and get its country
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: createOrderDto.restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${createOrderDto.restaurantId} not found`);
    }

        // 2. Validate menu items, check prices, and calculate total
    let totalAmount = 0;
    const itemsWithPrices: { menuItemId: number; quantity: number; price: number }[] = [];

    for (const item of createOrderDto.items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        throw new NotFoundException(`Menu item with ID ${item.menuItemId} not found`);
      }

      if (menuItem.restaurantId !== createOrderDto.restaurantId) {
        throw new BadRequestException(
          `Menu item ${menuItem.name} does not belong to restaurant ${restaurant.name}`,
        );
      }

      totalAmount += menuItem.price * item.quantity;
      itemsWithPrices.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    // 3. Create the order and items inside a transaction
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          restaurantId: createOrderDto.restaurantId,
          status: 'PENDING',
          paymentMethod: createOrderDto.paymentMethod,
          totalAmount,
          country: restaurant.country,
        },
      });

      // Create all order items
      await Promise.all(
        itemsWithPrices.map((item) =>
          tx.orderItem.create({
            data: {
              orderId: order.id,
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
            },
          }),
        ),
      );

      // Return created order with details
      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          restaurant: true,
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    });
  }

  async checkout(id: number) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(`Order cannot be checked out because it is already ${order.status}`);
    }

    return prisma.order.update({
      where: { id },
      data: { status: 'PLACED' },
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  async cancel(id: number) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Order is already cancelled');
    }

    return prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  async updatePaymentMethod(id: number, paymentMethod: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return prisma.order.update({
      where: { id },
      data: { paymentMethod },
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  async findAll(country?: string, userId?: number) {
    const whereClause: any = {};
    if (country) {
      whereClause.country = country;
    }
    if (userId) {
      whereClause.userId = userId;
    }

    return prisma.order.findMany({
      where: whereClause,
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            country: true,
          },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}

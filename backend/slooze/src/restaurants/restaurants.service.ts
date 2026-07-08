import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../lib/prisma';

@Injectable()
export class RestaurantsService {
  async findAll(country?: string) {
    if (country) {
      return prisma.restaurant.findMany({
        where: { country },
      });
    }
    return prisma.restaurant.findMany();
  }

  async findOne(id: number) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  async findMenu(restaurantId: number) {
    // Ensure the restaurant exists
    await this.findOne(restaurantId);

    return prisma.menuItem.findMany({
      where: { restaurantId },
    });
  }
}

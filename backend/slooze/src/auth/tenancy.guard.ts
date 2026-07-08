import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { prisma } from '../lib/prisma';
import { TenancyResourceType } from '../types';

@Injectable()
export class TenancyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resourceType = this.reflector.getAllAndOverride<TenancyResourceType>(
      'tenancyResourceType',
      [context.getHandler(), context.getClass()],
    );

    if (!resourceType) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false; // Authentication missing
    }

    // Admins have global access and bypass country checks, EXCEPT for personal order checks
    if (user.role === 'ADMIN' && resourceType !== 'order') {
      return true;
    }

    const userCountry = user.country;
    if (!userCountry) {
      throw new ForbiddenException('Access denied: User country is not defined');
    }

    const params = request.params;
    const body = request.body;

    if (resourceType === 'restaurant') {
      const restaurantId = +params.id;
      if (isNaN(restaurantId)) {
        return true; // Let validation pipeline handle invalid param types
      }

      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });
      if (restaurant && restaurant.country !== userCountry) {
        throw new ForbiddenException(
          `Access denied: You can only view items inside [${userCountry}]. This item is in [${restaurant.country}].`,
        );
      }
    } else if (resourceType === 'order') {
      const orderId = +params.id;
      if (isNaN(orderId)) {
        return true;
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (order) {
        // Only enforce country checks for non-admins
        if (user.role !== 'ADMIN' && order.country !== userCountry) {
          throw new ForbiddenException(
            `Access denied: You can only access orders inside [${userCountry}]. This order is in [${order.country}].`,
          );
        }
        // Every user (including Admin) can only access their own orders
        if (order.userId !== user.sub) {
          throw new ForbiddenException(`Access denied: You can only access your own orders.`);
        }
      }
    } else if (resourceType === 'bodyRestaurant') {
      const restaurantId = +body.restaurantId;
      if (isNaN(restaurantId)) {
        return true;
      }

      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });
      if (restaurant && restaurant.country !== userCountry) {
        throw new ForbiddenException(
          `Access denied: You can only place orders to restaurants in [${userCountry}].`,
        );
      }
    } else if (resourceType === 'list') {
      // Automatically force user's country filter on search listing requests
      request.query.country = userCountry;
    } else if (resourceType === 'listRestaurants') {
      // Allow loading all restaurants globally so the UI can render non-matching nodes as faded/disabled
    }

    return true;
  }
}

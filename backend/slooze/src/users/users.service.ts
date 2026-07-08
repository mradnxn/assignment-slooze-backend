import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.checkEmailExists(createUserDto.email);
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
        role: createUserDto.role,
        country: createUserDto.country || null,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await prisma.user.findMany();
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    let hashedPassword = user.password;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email ?? user.email,
        name: updateUserDto.name ?? user.name,
        password: hashedPassword,
        role: updateUserDto.role ?? user.role,
        country: updateUserDto.country !== undefined ? updateUserDto.country : user.country,
      },
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await prisma.user.delete({ where: { id } });
    return { message: `User with ID ${id} deleted successfully` };
  }
}

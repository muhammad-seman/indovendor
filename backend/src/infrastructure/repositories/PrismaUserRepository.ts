import { PrismaClient } from '@prisma/client';
import { UserRepository, CreateUserData } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        vendor: true
      }
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        vendor: true
      }
    });
    return user;
  }

  async create(userData: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        role: userData.role as any,
        phone: userData.phone,
        isVerified: false
      },
      include: {
        profile: true,
        vendor: true
      }
    });
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userData,
      include: {
        profile: true,
        vendor: true
      }
    });
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }
}
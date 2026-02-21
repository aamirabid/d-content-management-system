import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.permission.create({ data });
  }

  async findAll(offset = 0, limit = 10, search = '') {
    const where: any = {};
    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.permission.findMany({
      where,
      skip: offset,
      take: limit,
    });
  }

  async findByKey(key: string) {
    return this.prisma.permission.findUnique({ where: { key } });
  }

  async findById(id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.permission.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.permission.delete({ where: { id } });
  }

  async count(search = '') {
    const where: any = {};
    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.permission.count({ where });
  }
}

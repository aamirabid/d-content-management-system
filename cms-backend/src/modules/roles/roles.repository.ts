import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.role.create({ data });
  }

  async findAll(offset = 0, limit = 10, search = '') {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.role.findMany({
      where,
      skip: offset,
      take: limit,
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async count(search = '') {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.role.count({ where });
  }

  async findById(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.role.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }

  async setPermissions(roleId: string, permissionIds: string[]) {
    // simple replace: remove existing then create
    await this.prisma.rolePermission.deleteMany({ where: { roleId } });
    const ops = permissionIds.map((pid) => ({ roleId, permissionId: pid }));
    return this.prisma.rolePermission.createMany({ data: ops });
  }
}

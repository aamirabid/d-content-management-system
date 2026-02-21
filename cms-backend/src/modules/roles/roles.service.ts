import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private rolesRepo: RolesRepository) {}

  async create(data: any) {
    return this.rolesRepo.create(data);
  }

  async list(page = 1, limit = 10, search = '') {
    const l = Math.min(limit, 50);
    const offset = (page - 1) * l;
    const items = await this.rolesRepo.findAll(offset, l, search);
    const total = await this.rolesRepo.count(search);
    const totalPages = Math.ceil(total / l);
    return { items, meta: { page, limit: l, total, totalPages } };
  }

  async findById(id: string) {
    const r = await this.rolesRepo.findById(id);
    if (!r) throw new NotFoundException('Role not found');
    return r;
  }

  async update(id: string, data: any) {
    return this.rolesRepo.update(id, data);
  }

  async remove(id: string) {
    return this.rolesRepo.delete(id);
  }

  async setPermissions(id: string, permissionIds: string[]) {
    return this.rolesRepo.setPermissions(id, permissionIds);
  }
}

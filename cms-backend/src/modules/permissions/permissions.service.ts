import { Injectable, ConflictException } from '@nestjs/common';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private repo: PermissionsRepository) {}

  async create(data: { key: string; description?: string }) {
    const exists = await this.repo.findByKey(data.key);
    if (exists) throw new ConflictException('Permission already exists');
    return this.repo.create(data);
  }

  async list(page = 1, limit = 10, search = '') {
    const l = Math.min(limit, 50);
    const offset = (page - 1) * l;
    const items = await this.repo.findAll(offset, l, search);
    const total = await this.repo.count(search);
    const totalPages = Math.ceil(total / l);
    return { items, meta: { page, limit: l, total, totalPages } };
  }

  async findById(id: string) {
    return this.repo.findById(id);
  }

  async update(id: string, data: { key?: string; description?: string }) {
    return this.repo.update(id, data);
  }

  async remove(id: string) {
    return this.repo.remove(id);
  }
}

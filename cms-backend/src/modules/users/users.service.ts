import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  async findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  async findById(id: string) {
    const u = await this.usersRepo.findById(id);
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async list(page = 1, limit = 10, search = '') {
    const l = Math.min(limit, 50);
    const offset = (page - 1) * l;
    const items = await this.usersRepo.findAll(offset, l, search);
    const total = await this.usersRepo.count(search);
    const totalPages = Math.ceil(total / l);
    return { items, meta: { page, limit: l, total, totalPages } };
  }

  async update(id: string, payload: any) {
    const data: any = { ...payload };
    if (payload.password) {
      const hash = await bcrypt.hash(payload.password, 10);
      data.passwordHash = hash;
      delete data.password;
    }
    const roles = data.roles;
    if (roles) delete data.roles;

    const updated = await this.usersRepo.update(id, data);
    if (roles && Array.isArray(roles)) {
      await this.usersRepo.setRoles(id, roles);
    }
    return updated;
  }

  async create(payload: any) {
    const password = payload.password || Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(password, 10);
    const data: any = {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      passwordHash,
      isActive: payload.isActive ?? true,
    };
    const user = await this.usersRepo.create(data);
    if (
      payload.roles &&
      Array.isArray(payload.roles) &&
      payload.roles.length > 0
    ) {
      await this.usersRepo.setRoles(user.id, payload.roles);
    }
    return { ...user, password };
  }

  async setStatus(id: string, isActive: boolean) {
    return this.usersRepo.update(id, { isActive });
  }

  async remove(id: string) {
    return this.usersRepo.remove(id);
  }
}

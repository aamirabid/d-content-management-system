import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './blog.repository';

@Injectable()
export class BlogService {
  constructor(private repo: BlogRepository) {}

  async create(data: any) {
    // If status is 'published' ensure publishedAt is set; otherwise clear it
    if (data.status === 'published') {
      if (!data.publishedAt) data.publishedAt = new Date();
    } else {
      data.publishedAt = null;
    }

    return this.repo.create({
      ...data,
      translations: { create: data.translations },
    });
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
    const b = await this.repo.findById(id);
    if (!b) throw new NotFoundException('Blog not found');
    return b;
  }

  async update(id: string, data: any) {
    // handle translations separately if provided but also apply other fields
    if (data.translations) {
      const updateData: any = { ...data };
      // remove translations from top-level so we can use nested create
      delete updateData.translations;

      // ensure publishedAt handling: if status is published and no publishedAt provided, set to now
      if (updateData.status === 'published' && !updateData.publishedAt) {
        updateData.publishedAt = new Date();
      }
      if (updateData.status !== 'published') {
        updateData.publishedAt = null;
      }

      await this.repo.update(id, {
        ...updateData,
        translations: { deleteMany: {}, create: data.translations },
      });
      const updated = await this.repo.findById(id);
      return updated;
    }
    // if no translations provided, just update normally
    // handle publishedAt/status normalization
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    if (data.status !== 'published') {
      data.publishedAt = null;
    }
    return this.repo.update(id, data);
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }

  async publicList(language = 'en', page = 1, limit = 10) {
    const l = Math.min(limit, 50);
    const offset = (page - 1) * l;
    return this.repo.findPublic(language, offset, l);
  }

  async publicBySlug(slug: string, language = 'en') {
    const blog = await this.repo.findPublicBySlug(slug, language);
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }
}

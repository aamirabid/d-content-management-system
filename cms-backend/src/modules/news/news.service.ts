import { Injectable, NotFoundException } from '@nestjs/common';
import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService {
  constructor(private repo: NewsRepository) {}

  async create(data: any) {
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
    const n = await this.repo.findById(id);
    if (!n) throw new NotFoundException('News not found');
    return n;
  }

  async update(id: string, data: any) {
    if (data.translations) {
      const updateData: any = { ...data };
      delete updateData.translations;

      // handle published/expiry fields if provided
      if (updateData.status === 'published' && !updateData.publishedAt) {
        updateData.publishedAt = new Date();
      }
      // if not published, clear publishedAt
      if (updateData.status !== 'published') {
        updateData.publishedAt = null;
      }

      if (updateData.expiresAt) {
        // leave as provided (assumed converted by class-transformer)
      }

      await this.repo.update(id, {
        ...updateData,
        translations: { deleteMany: {}, create: data.translations },
      });
      return this.repo.findById(id);
    }
    // normalize status/publishedAt when no translations
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
    const news = await this.repo.findPublicBySlug(slug, language);
    if (!news) throw new NotFoundException('News not found');
    return news;
  }
}

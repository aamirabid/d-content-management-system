import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NewsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.news.create({ data, include: { translations: true } });
  }

  async findById(id: string) {
    return this.prisma.news.findUnique({
      where: { id },
      include: { translations: true },
    });
  }

  async findAll(offset = 0, limit = 10, search = '') {
    const where: any = {};
    if (search && search.trim()) {
      where.OR = [
        {
          translations: {
            some: { title: { contains: search, mode: 'insensitive' } },
          },
        },
        {
          translations: {
            some: { content: { contains: search, mode: 'insensitive' } },
          },
        },
      ];
    }
    return this.prisma.news.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: { translations: true },
    });
  }

  async count(search = '') {
    const where: any = {};
    if (search && search.trim()) {
      where.OR = [
        {
          translations: {
            some: { title: { contains: search, mode: 'insensitive' } },
          },
        },
        {
          translations: {
            some: { content: { contains: search, mode: 'insensitive' } },
          },
        },
      ];
    }
    return this.prisma.news.count({ where });
  }

  async update(id: string, data: any) {
    return this.prisma.news.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.news.delete({ where: { id } });
  }

  async findPublic(languageCode: string, offset = 0, limit = 10) {
    const now = new Date();
    const items = await this.prisma.news.findMany({
      where: {
        status: 'published',
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      skip: offset,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { translations: { where: { languageCode } } },
    });

    const total = await this.prisma.news.count({
      where: {
        status: 'published',
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    });

    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findPublicBySlug(slug: string, languageCode: string) {
    const now = new Date();
    return this.prisma.news.findFirst({
      where: {
        slug,
        status: 'published',
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      include: {
        translations: { where: { languageCode } },
        author: true,
      },
    });
  }
}

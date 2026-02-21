import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.blog.create({ data, include: { translations: true } });
  }

  async findById(id: string) {
    return this.prisma.blog.findUnique({
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
    return this.prisma.blog.findMany({
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
    return this.prisma.blog.count({ where });
  }

  async update(id: string, data: any) {
    return this.prisma.blog.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.blog.delete({ where: { id } });
  }

  async findPublic(languageCode: string, offset = 0, limit = 10) {
    const now = new Date();
    const items = await this.prisma.blog.findMany({
      where: { status: 'published', publishedAt: { lte: now } },
      skip: offset,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { translations: { where: { languageCode } } },
    });

    const total = await this.prisma.blog.count({
      where: { status: 'published', publishedAt: { lte: now } },
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
    return this.prisma.blog.findFirst({
      where: { slug, status: 'published', publishedAt: { lte: now } },
      include: {
        translations: { where: { languageCode } },
        author: true,
      },
    });
  }
}

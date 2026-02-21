import {
  IsOptional,
  IsString,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BlogTranslationDto {
  @ApiProperty({ example: 'en', description: 'Language code' })
  @IsString()
  languageCode: string;

  @ApiProperty({ example: 'Blog Title', description: 'Post title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Updated content...', description: 'Post content' })
  @IsString()
  content: string;
}

export class UpdateBlogDto {
  @ApiProperty({
    example: 'updated-blog-slug',
    description: 'URL slug',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'published',
    enum: ['draft', 'published'],
    required: false,
  })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiProperty({ type: 'array', items: { type: 'object' }, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogTranslationDto)
  translations?: BlogTranslationDto[];

  @ApiProperty({
    example: '2026-02-20T10:00:00Z',
    description: 'Publication date',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  publishedAt?: Date;
}

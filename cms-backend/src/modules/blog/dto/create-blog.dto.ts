import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsIn,
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

  @ApiProperty({ example: 'Blog content...', description: 'Post content' })
  @IsString()
  content: string;
}

export class CreateBlogDto {
  @ApiProperty({ example: 'my-first-blog', description: 'URL slug' })
  @IsString()
  slug: string;

  @ApiProperty({
    example: 'published',
    enum: ['draft', 'published'],
    required: false,
  })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiProperty({
    example: 'user-id',
    description: 'Author user ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({
    example: '2026-02-20T10:00:00Z',
    description: 'Publication date',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  publishedAt?: Date;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogTranslationDto)
  translations: BlogTranslationDto[];
}

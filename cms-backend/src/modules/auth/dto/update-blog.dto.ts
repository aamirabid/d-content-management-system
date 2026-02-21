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

  @ApiProperty({ example: 'Blog content...', description: 'Post content' })
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
  @ApiProperty({ type: 'array', items: { type: 'object' }, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogTranslationDto)
  translations?: BlogTranslationDto[];
}

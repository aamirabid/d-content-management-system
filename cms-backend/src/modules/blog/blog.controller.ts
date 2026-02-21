import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private svc: BlogService) {}

  // Admin endpoints
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @Permissions('blog.create')
  @ApiResponse({ status: 201, description: 'Blog created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateBlogDto })
  async create(@Body() body: CreateBlogDto, @Req() req: any) {
    // Force authorId to the currently authenticated user
    const user = req.user;
    if (!user) throw new ForbiddenException('User not authenticated');
    body.authorId = user.id;
    return this.svc.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @Permissions('blog.read')
  @ApiResponse({ status: 200, description: 'Blogs retrieved' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: '' })
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    return this.svc.list(Number(page), Number(limit), search);
  }

  // Public endpoint (must come after list, before :id)
  @Get('public')
  @ApiResponse({ status: 200, description: 'Published blogs retrieved' })
  @ApiQuery({ name: 'language', required: false, example: 'en' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async publicList(
    @Query('language') language = 'en',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.svc.publicList(language, Number(page), Number(limit));
  }

  // Public endpoint for getting a single blog by slug (no auth required)
  @Get('public/slug/:slug')
  @ApiResponse({ status: 200, description: 'Published blog retrieved' })
  @ApiQuery({ name: 'language', required: false, example: 'en' })
  async publicBySlug(
    @Param('slug') slug: string,
    @Query('language') language = 'en',
  ) {
    return this.svc.publicBySlug(slug, language);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  @Permissions('blog.read')
  @ApiResponse({ status: 200, description: 'Blog retrieved' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async get(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @Permissions('blog.update')
  @ApiResponse({ status: 200, description: 'Blog updated' })
  @ApiBody({ type: UpdateBlogDto })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBlogDto,
    @Req() req: any,
  ) {
    const user = req.user;
    if (!user) throw new ForbiddenException('User not authenticated');
    // Allow updating (PermissionsGuard ensures user has 'blog.update')
    return this.svc.update(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  @Permissions('blog.delete')
  @ApiResponse({ status: 200, description: 'Blog deleted' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    if (!user) throw new ForbiddenException('User not authenticated');
    // PermissionsGuard already ensures the user has 'blog.delete'. Allow deletion.
    return this.svc.remove(id);
  }
}

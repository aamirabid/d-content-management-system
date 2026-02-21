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
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private svc: NewsService) {}

  // Admin endpoints
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @Permissions('news.create')
  @ApiResponse({ status: 201, description: 'News created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateNewsDto })
  async create(@Body() body: CreateNewsDto, @Req() req: any) {
    const user = req.user;
    if (!user) throw new ForbiddenException('User not authenticated');
    body.authorId = user.id;
    return this.svc.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @Permissions('news.read')
  @ApiResponse({ status: 200, description: 'News retrieved' })
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
  @ApiResponse({ status: 200, description: 'Published news retrieved' })
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

  // Public endpoint for getting a single news item by slug (no auth required)
  @Get('public/slug/:slug')
  @ApiResponse({ status: 200, description: 'Published news item retrieved' })
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
  @Permissions('news.read')
  @ApiResponse({ status: 200, description: 'News retrieved' })
  @ApiResponse({ status: 404, description: 'News not found' })
  async get(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @Permissions('news.update')
  @ApiResponse({ status: 200, description: 'News updated' })
  @ApiBody({ type: UpdateNewsDto })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateNewsDto,
    @Req() req: any,
  ) {
    const user = req.user;
    if (!user) throw new ForbiddenException('User not authenticated');
    // PermissionsGuard ensures the user has 'news.update'. Allow update for permitted users.
    body.authorId = user.id;
    return this.svc.update(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  @Permissions('news.delete')
  @ApiResponse({ status: 200, description: 'News deleted' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    if (!user) throw new ForbiddenException('User not authenticated');
    // PermissionsGuard already ensures the user has 'news.delete'. Allow deletion.
    return this.svc.remove(id);
  }
}

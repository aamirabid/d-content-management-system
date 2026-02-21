import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'Users retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    return this.usersService.list(Number(page), Number(limit), search);
  }

  @Post()
  @Permissions('user.manage')
  @ApiResponse({ status: 201, description: 'User created' })
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body as any);
  }

  @Get(':id')
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'User retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async get(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'User updated' })
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Patch(':id/status')
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'User status updated' })
  async status(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.usersService.setStatus(id, body.isActive);
  }

  @Delete(':id')
  @Permissions('user.manage')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

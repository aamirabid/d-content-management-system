import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new ForbiddenException('User not authenticated');

    // Resolve user's permissions via roles -> rolePermission
    const roles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      select: { roleId: true },
    });
    const roleIds = roles.map((r) => r.roleId);

    if (roleIds.length === 0) throw new ForbiddenException('No roles assigned');

    const perms = await this.prisma.rolePermission.findMany({
      where: { roleId: { in: roleIds } },
      select: { permission: { select: { key: true } } },
    });

    const userPermKeys = new Set(perms.map((p) => p.permission.key));

    const hasAll = required.every((r) => userPermKeys.has(r));
    if (!hasAll) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}

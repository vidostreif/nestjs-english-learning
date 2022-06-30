import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserIncludeRole } from '../prisma/prisma.dto';
import { ROLES_KEY } from './rolesAuth.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private tokenService: AuthService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      // если не поставили декоратор с указанием ролей
      if (!requiredRoles) {
        throw new UnauthorizedException(
          'Не указан список разрешенных пользователей',
        );
      }

      // если роли не указаны или в списке есть all, то разрешаем проход
      if (requiredRoles.length === 0 || requiredRoles.includes('all')) {
        return true;
      }

      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new UnauthorizedException(
          'В запросе не найден заголовок авторизации',
        );
      }

      const acccessToken = authorizationHeader.split(' ')[1];
      if (!acccessToken) {
        throw new UnauthorizedException('В запросе не найден токен');
      }

      const userData = this.tokenService.validateAccessToken(acccessToken);
      if (!userData) {
        throw new UnauthorizedException('Не удалось расшифровать токен');
      }

      const user = userData as UserIncludeRole;
      req.user = user;

      // проверяем, совпадает роль пользователя с ролью, которую указали в декораторе
      return requiredRoles.includes(user.userRole.name);
    } catch (error) {
      throw error;
    }
  }
}

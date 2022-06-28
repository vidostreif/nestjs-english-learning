import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserIncludeRole } from '../prisma/prisma.dto';
import { TokensService } from './tokens.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenService: TokensService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new UnauthorizedException('Пользователь не автризован');
      }

      const acccessToken = authorizationHeader.split(' ')[1];
      if (!acccessToken) {
        throw new UnauthorizedException('Пользователь не автризован');
      }

      const userData = this.tokenService.validateAccessToken(acccessToken);
      if (!userData) {
        throw new UnauthorizedException('Пользователь не автризован');
      }

      req.user = userData as UserIncludeRole;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Пользователь не автризован');
    }
  }
}

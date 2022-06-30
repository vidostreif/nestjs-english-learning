import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthorizationGuard } from './authorization.guard';
// import { IsAuthorized } from './isAuthorized.guard';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService],
  imports: [
    JwtModule.register({
      // secret: process.env.JWT_ACCESS_SECRET,
      // signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  exports: [TokensService],
})
export class TokensModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IsAuthorized } from './isAuthorized.guard';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService, IsAuthorized],
  imports: [
    JwtModule.register({
      // secret: process.env.JWT_ACCESS_SECRET,
      // signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  exports: [TokensService, IsAuthorized],
})
export class TokensModule {}

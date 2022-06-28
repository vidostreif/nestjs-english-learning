import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService, JwtAuthGuard],
  imports: [
    JwtModule.register({
      // secret: process.env.JWT_ACCESS_SECRET,
      // signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  exports: [TokensService, JwtAuthGuard],
})
export class TokensModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService],
  imports: [
    JwtModule.register({
      // secret: process.env.JWT_ACCESS_SECRET,
      // signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  exports: [TokenService],
})
export class TokenModule {}

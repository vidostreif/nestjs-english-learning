import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthorizationGuard } from './authorization.guard';
// import { IsAuthorized } from './isAuthorized.guard';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  imports: [
    JwtModule.register({
      // secret: process.env.JWT_ACCESS_SECRET,
      // signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}

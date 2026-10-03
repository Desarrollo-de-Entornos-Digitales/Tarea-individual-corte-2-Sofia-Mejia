import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role-permission/role-permission.module';

@Module({
    imports: [
        UserModule,
        RoleModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET') || 'defaultSecret',
                signOptions: {
                    expiresIn: config.get<StringValue | number>('JWT_EXPIRES_IN') || '1h',
                },
            }),
        }),
        PermissionModule,
        RolePermissionModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}

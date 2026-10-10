import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';

import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RolePermission, Role, Permission])],
    controllers: [RolePermissionController],
    providers: [RolePermissionService],
    exports: [RolePermissionService],
})
export class RolePermissionModule {}

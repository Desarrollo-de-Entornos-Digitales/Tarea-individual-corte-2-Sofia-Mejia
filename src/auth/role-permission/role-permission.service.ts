import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceNotFoundException } from '../../common/exceptions';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';

import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Injectable()
export class RolePermissionService {
    constructor(
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    private async validateReferences(roleId?: number, permissionId?: number): Promise<void> {
        if (roleId && !(await this.roleRepository.existsBy({ id: roleId }))) {
            throw new ResourceNotFoundException('Rol', roleId);
        }
        if (permissionId && !(await this.permissionRepository.existsBy({ id: permissionId }))) {
            throw new ResourceNotFoundException('Permiso', permissionId);
        }
    }

    private async ensureNotDuplicated(roleId: number, permissionId: number, ignoreId?: number): Promise<void> {
        const existing = await this.rolePermissionRepository.findOne({
            where: { role: { id: roleId }, permission: { id: permissionId } },
        });
        if (existing && existing.id !== ignoreId) {
            throw new ConflictException('El rol ya tiene asignado este permiso.');
        }
    }

    async create(dto: CreateRolePermissionDto): Promise<RolePermission> {
        await this.validateReferences(dto.roleId, dto.permissionId);
        await this.ensureNotDuplicated(dto.roleId, dto.permissionId);

        const rolePermission = this.rolePermissionRepository.create({
            role: { id: dto.roleId },
            permission: { id: dto.permissionId },
        });
        const saved = await this.rolePermissionRepository.save(rolePermission);

        return await this.findOne(saved.id);
    }

    async findAll(): Promise<RolePermission[]> {
        return await this.rolePermissionRepository.find({
            relations: { role: true, permission: true },
            order: { id: 'ASC' },
        });
    }

    async findOne(id: number): Promise<RolePermission> {
        const rolePermission = await this.rolePermissionRepository.findOne({
            where: { id },
            relations: { role: true, permission: true },
        });
        if (!rolePermission) {
            throw new ResourceNotFoundException('Asignación rol-permiso', id);
        }
        return rolePermission;
    }

    async update(id: number, dto: UpdateRolePermissionDto): Promise<RolePermission> {
        const current = await this.findOne(id);
        await this.validateReferences(dto.roleId, dto.permissionId);

        const roleId = dto.roleId ?? current.role.id;
        const permissionId = dto.permissionId ?? current.permission.id;
        await this.ensureNotDuplicated(roleId, permissionId, id);

        await this.rolePermissionRepository.update(id, {
            role: { id: roleId },
            permission: { id: permissionId },
        });
        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);
        await this.rolePermissionRepository.delete(id);
        return { id };
    }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceNotFoundException } from '../../common/exceptions';
import { Permission } from '../entities/permission.entity';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    private async ensureNameAvailable(name: string, ignoreId?: number): Promise<void> {
        const existing = await this.permissionRepository.findOneBy({ name });
        if (existing && existing.id !== ignoreId) {
            throw new ConflictException(`Ya existe un permiso con el nombre '${name}'.`);
        }
    }

    async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        await this.ensureNameAvailable(createPermissionDto.name);
        const permission = this.permissionRepository.create(createPermissionDto);
        return await this.permissionRepository.save(permission);
    }

    async findAll(): Promise<Permission[]> {
        return await this.permissionRepository.find({ order: { id: 'ASC' } });
    }

    async findOne(id: number): Promise<Permission> {
        const permission = await this.permissionRepository.findOneBy({ id });
        if (!permission) {
            throw new ResourceNotFoundException('Permiso', id);
        }
        return permission;
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
        await this.findOne(id);
        if (updatePermissionDto.name) {
            await this.ensureNameAvailable(updatePermissionDto.name, id);
        }
        await this.permissionRepository.update(id, updatePermissionDto);
        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);
        await this.permissionRepository.delete(id);
        return { id };
    }
}

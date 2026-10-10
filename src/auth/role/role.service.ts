import { ConflictException, Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RoleNotFoundException } from '../../common/exceptions';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const existing = await this.roleRepository.findOneBy({ name: createRoleDto.name });
        if (existing) {
            throw new ConflictException(`Ya existe un rol con el nombre '${createRoleDto.name}'.`);
        }

        const newRole = this.roleRepository.create(createRoleDto);

        return await this.roleRepository.save(newRole);
    }

    async findAll(): Promise<Role[]> {
        return await this.roleRepository.find({
            relations: { rolePermissions: { permission: true } },
            order: { id: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Role> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: { rolePermissions: { permission: true } },
        });
        if (!role) {
            throw new RoleNotFoundException(id);
        }
        return role;
    }

    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
        await this.findOne(id);
        await this.roleRepository.update(id, updateRoleDto);

        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);

        // No se puede eliminar un rol que todavía tiene usuarios asignados
        if (await this.userRepository.existsBy({ role: { id } })) {
            throw new ConflictException('No se puede eliminar un rol que tiene usuarios asignados.');
        }

        await this.roleRepository.delete(id);

        return { id };
    }

    /**
     * Retorna todos los roles junto con su listado de usuarios asociados.
     */
    async findAllWithUsers(): Promise<Role[]> {
        return await this.roleRepository.find({
            relations: {
                users: true,
            },
            order: {
                name: 'ASC',
            },
        });
    }

    /**
     * Retorna un rol con todos sus permisos anidados
     * a través de la relación rolePermissions -> permission.
     */
    async findOneWithPermissions(id: number): Promise<Role | null> {
        return await this.roleRepository.findOne({
            where: {
                id,
            },
            relations: {
                rolePermissions: {
                    permission: true,
                },
            },
        });
    }

    /**
     * Busca roles cuyo nombre contenga un texto parcial.
     */
    async search(search: string): Promise<Role[]> {
        return await this.roleRepository.find({
            where: {
                name: ILike(`%${search}%`),
            },
            relations: {},
            order: {
                name: 'ASC',
            },
        });
    }
}

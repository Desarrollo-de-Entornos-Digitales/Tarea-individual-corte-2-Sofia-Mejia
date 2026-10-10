import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Between, ILike, IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RoleNotFoundException, UserNotFoundException } from '../../common/exceptions';
import { User } from '../entities/user.entity';
import { RoleService } from '../role/role.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService,
        private readonly configService: ConfigService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { roleId, ...userData } = createUserDto;
        const role = await this.roleService.findOne(roleId);
        if (!role) {
            throw new RoleNotFoundException(roleId);
        }

        const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS') ?? '10', 10);

        const passwordHashed = await bcrypt.hash(userData.passwordHash, saltRounds);

        const user = this.userRepository.create({
            ...userData,
            passwordHash: passwordHashed,
            role,
        });

        const savedUser = await this.userRepository.save(user);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _, ...userWithoutPassword } = savedUser;
        return userWithoutPassword as User;
    }

    private omitPassword(user: User): User {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _, ...safeUser } = user;
        return safeUser as User;
    }

    async findAll(): Promise<User[]> {
        const users = await this.userRepository.find({
            relations: {
                role: true,
            },
            order: { id: 'ASC' },
        });
        return users.map((user) => this.omitPassword(user));
    }

    /**
     * Versión pública de findOne: incluye el rol pero nunca el hash de la contraseña.
     */
    async findOneProfile(id: number): Promise<User> {
        const user = await this.findOne(id, false);
        const withRole = await this.userRepository.findOne({ where: { id }, relations: { role: true } });
        return this.omitPassword(withRole ?? user);
    }

    async findOne(id: number, relations: boolean = false): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: { role: relations ? { rolePermissions: { permission: true } } : false },
        });
        if (!user) {
            throw new UserNotFoundException(id);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: {
                role: {
                    rolePermissions: {
                        permission: true,
                    },
                },
            },
        });
        return user || null;
    }

    // /**
    //  * Find one user with their role
    //  */
    // findOne(id: number) {
    //     return this.userRepository.findOne({
    //         where: { id },
    //         relations: ['role'],
    //     });
    // }

    // /**
    //  * Find user with role and permissions
    //  */
    // async findOneWithPermissions(id: number) {
    //     return await this.userRepository.findOne({
    //         where: { id },
    //         relations: ['role', 'role.permissions'],
    //     });
    // }

    // /**
    //  * Find all users with their roles and permissions
    //  */
    // async findAllWithPermissions() {
    //     return await this.userRepository.find({
    //         relations: ['role', 'role.permissions'],
    //         order: { createdAt: 'DESC' },
    //     });
    // }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.findOne(id);

        const { roleId, passwordHash, ...data } = updateUserDto;
        const changes: Parameters<Repository<User>['update']>[1] = { ...data };

        if (roleId) {
            const role = await this.roleService.findOne(roleId);
            if (!role) {
                throw new RoleNotFoundException(roleId);
            }
            changes.role = { id: roleId };
        }

        if (passwordHash) {
            const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS') ?? '10', 10);
            changes.passwordHash = await bcrypt.hash(passwordHash, saltRounds);
        }

        if (Object.keys(changes).length > 0) {
            await this.userRepository.update(id, changes);
        }
        return this.findOneProfile(id);
    }

    async remove(id: number) {
        await this.findOne(id);
        const result = await this.userRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }

    /**
     * Find users by role name
     */
    async findByRole(roleName: string) {
        return await this.userRepository.find({
            where: { role: { name: roleName } },
            relations: {
                role: true,
            },
            order: { username: 'ASC' },
        });
    }

    /**
     * Count total users
     */
    async count(): Promise<number> {
        return await this.userRepository.count();
    }

    /**
     * Count users by role
     */
    async countByRole(roleName: string): Promise<number> {
        return await this.userRepository.count({
            where: {
                role: {
                    name: roleName,
                },
            },
            relations: {
                role: true,
            },
        });
    }

    /**
     * Retorna usuarios registrados dentro de un rango de fechas con paginación.
     * Demuestra el operador Between(), ordenamiento y paginación con findAndCount().
     */
    async findUsersCreatedBetween(startDate: Date, endDate: Date, limit = 10, offset = 0) {
        return await this.userRepository.findAndCount({
            where: {
                createdAt: Between(startDate, endDate),
            },
            relations: {
                role: true,
            },
            order: {
                createdAt: 'DESC',
            },
            take: limit,
            skip: offset,
        });
    }

    /**
     * Búsqueda por coincidencia parcial en username o email, requiriendo que tenga bio.
     * Demuestra condiciones tipo OR (pasando un arreglo a where) y el operador Not(IsNull()).
     */
    async searchUsersWithBio(term: string) {
        return await this.userRepository.find({
            where: [
                { username: ILike(`%${term}%`), bio: Not(IsNull()) },
                { email: ILike(`%${term}%`), bio: Not(IsNull()) },
            ],
            relations: {
                role: true,
            },
            order: {
                username: 'ASC',
            },
        });
    }

    /**
     * Obtiene el usuario con su rol y los permisos asociados cargando relaciones anidadas
     * con findOne() sin necesidad de QueryBuilder.
     */
    async getUserWithPermissions(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                role: {
                    rolePermissions: {
                        permission: true,
                    },
                },
            },
        });

        if (!user) {
            return null;
        }

        const permissions = user.role?.rolePermissions?.map((rp) => rp.permission) || [];
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            createdAt: user.createdAt,
            role: {
                id: user.role.id,
                name: user.role.name,
                description: user.role.description,
            },
            permissions,
        };
    }
}

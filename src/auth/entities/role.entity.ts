import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RolePermission } from './role-permission.entity';
import { User } from './user.entity';

@Entity('roles') // Tabla 'roles'
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 50 }) // Nombre único del rol
    name!: string;

    @Column({ length: 255 })
    description!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    // Un rol tiene muchos permisos a través de la tabla intermedia role_permissions
    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions!: RolePermission[];

    // Un rol puede estar asignado a muchos usuarios, pero cada usuario tiene un solo rol
    @OneToMany(() => User, (user) => user.role)
    users!: User[];
}

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RolePermission } from './role-permission.entity';

@Entity('permissions') // Tabla 'permissions'
export class Permission {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 50 }) // Nombre único del permiso (ej. 'create_routine')
    name!: string;

    @Column({ length: 255 })
    description!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
    rolePermissions!: RolePermission[];
}

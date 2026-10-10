import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity({ name: 'role_permissions' }) // Tabla intermedia N:M entre roles y permisos
@Unique(['role', 'permission']) // Un rol no puede tener el mismo permiso dos veces
export class RolePermission {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    // Si se elimina el rol, se eliminan sus asignaciones de permisos
    @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'role_id' })
    role!: Role;

    @ManyToOne(() => Permission, (permission) => permission.rolePermissions, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'permission_id' })
    permission!: Permission;
}

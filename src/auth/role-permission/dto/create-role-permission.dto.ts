import { IsInt, IsPositive } from 'class-validator';

export class CreateRolePermissionDto {
    @IsInt()
    @IsPositive()
    roleId!: number;

    @IsInt()
    @IsPositive()
    permissionId!: number;
}

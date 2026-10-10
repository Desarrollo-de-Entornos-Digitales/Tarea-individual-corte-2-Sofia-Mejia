import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    description!: string;
}

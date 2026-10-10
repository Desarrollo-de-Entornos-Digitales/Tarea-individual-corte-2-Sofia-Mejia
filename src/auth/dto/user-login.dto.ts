import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
    @IsEmail({}, { message: 'El correo electronico suministrado no es válido' })
    @IsNotEmpty({ message: 'El correo electronico es requerido' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password!: string;
}

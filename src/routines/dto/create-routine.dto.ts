import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
export class CreateRoutineDto {
    @IsInt()
    @IsPositive()
    userId!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsOptional()
    @IsString()
    description!: string;
}

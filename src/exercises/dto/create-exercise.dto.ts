import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
export class CreateExerciseDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsOptional()
    @IsString()
    description!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    type!: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    estimatedCalories!: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    estimatedDistanceKm!: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    estimatedDurationMin!: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    icon?: string;
}

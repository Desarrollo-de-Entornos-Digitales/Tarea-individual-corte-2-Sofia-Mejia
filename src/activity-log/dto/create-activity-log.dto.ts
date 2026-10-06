import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateActivityLogDto {
    @IsInt()
    @IsPositive()
    userId!: number;

    @IsInt()
    @IsPositive()
    routineId!: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startedAt?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    completedAt?: Date;
}

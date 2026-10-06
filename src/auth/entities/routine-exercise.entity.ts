import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { Exercises } from './exercises.entity';
import { Routine } from './routine.entity';
import { ActivityExercise } from './activity-exercise.entity';

@Entity('routine-exercises')
export class RoutineExercise {
    @PrimaryColumn()
    id!: number;

    @Column()
    orderIndex!: number;

    @Column()
    targetSets!: number;

    @Column()
    targetReps!: number;

    @Column()
    targetWeightKg!: number;

    @Column()
    targetDurationMin!: number;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @ManyToOne(() => Routine, (routine) => routine.routineExercises, {
        eager: false,
        nullable: false,
    })
    @JoinColumn({ name: 'routine_id' })
    routine!: Routine;

    @ManyToOne(() => Exercises, (exercise) => exercise.routineExercises, {
        eager: false,
        nullable: false,
    })
    @JoinColumn({ name: 'exercise_id' })
    exercise!: Exercises;

    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.routineExercise)
    activityExercise!: ActivityExercise[];
}

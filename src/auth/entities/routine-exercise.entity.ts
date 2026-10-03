import {Column, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {Exercise} from "./exercises.entity";
import {Routine} from "./routine.entity";
import {ActivityExercise} from "./activity-exercise.entity";

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

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt!: Date;

    @ManyToOne(() => Routine, (routine) => routine.routineExercises, {eager: false, nullable: false})
    @JoinColumn({name: "routine_id"})
    routine!: string;

    @ManyToOne(() => Exercise, (ex) => ex.routineExercises, {eager: false, nullable: false})
    @JoinColumn({name: "exercise_id"})
    exercise!: string;

    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.routineExercise)
    activityExercise!: []
}

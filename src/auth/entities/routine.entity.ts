import {Column, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import {User} from "./user.entity";
import {PrimaryColumn} from "typeorm/browser";
import {RoutineExercise} from "./routine-exercise.entity";
import {ActivityLog} from "./activity-log.entity";
export class Routine {

    @PrimaryColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'}) // Automatically set the creation date of the user record to the current timestamp
    createdAt!: Date;

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'}) // Automatically set the creation date of the user record to the current timestamp
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.routines, {eager: false})
    @JoinColumn({name: "user_id"})
    user!: string;

    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.exercise)
    routineExercises!: []

    @OneToMany(() => ActivityLog, (activityLog) => activityLog.routine)
    activities!: []
}
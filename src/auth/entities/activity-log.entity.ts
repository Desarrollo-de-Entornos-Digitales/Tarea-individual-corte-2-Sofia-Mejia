import {Column, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {Routine} from "./routine.entity";
import {ActivityExercise} from "./activity-exercise.entity";

export class ActivityLog {

    @PrimaryColumn()
    id!: number;

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'}) // Automatically set the creation date of the user record to the current timestamp
    startedAt!: Date;

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'}) // Automatically set the creation date of the user record to the current timestamp
    completedAt!: Date;

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'}) // Automatically set the creation date of the user record to the current timestamp
    createdAt!: Date;

    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.activityLog)
    activityExercise!: []

    @ManyToOne(() => Routine, (routine) => routine.activities, {eager: false, nullable: false}) // Many-to-one relationship with Role entity, meaning that each user can have one role, but a role can be assigned to many users
    @JoinColumn({name: 'routine_id'}) // Eager loading is enabled for the role relationship, meaning that when a user is fetched from the database, the associated role will be loaded automatically without needing to specify it in the query
    routine!: Routine;

    


}
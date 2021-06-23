import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid'
import Surveys from "./Surveys";
import Users from "./Users";

@Entity("surveys_users")
class SurveysUsers {
    @PrimaryColumn()
    readonly id: string

    @Column()
    user_id: string

    @ManyToOne(() => Users)
    @JoinColumn({name: 'user_id'})
    user: Users

    @Column()
    survey_id: string

    @ManyToOne(() => Surveys)
    @JoinColumn({name: 'survey_id'})
    survey: Surveys

    @Column()
    value: number

    @CreateDateColumn()
    created_at: Date

    constructor() {
        if(!this.id) {
            this.id = uuid()
        }
    }
}

export default SurveysUsers
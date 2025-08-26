import { CoreEntity } from "src/utils/core-entity";
import { Column, Entity } from "typeorm";

@Entity("master_user_accessible_sbu")
export class UserAccessibleSbu extends CoreEntity {
    @Column()
    user_id: number;

    @Column()
    sbu_id: number;
}

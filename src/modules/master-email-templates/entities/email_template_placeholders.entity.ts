import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { MasterEmailTemplate } from "./master_email_templates.entity"; // Your existing template entity
import { CoreEntity } from "src/utils/core-entity";
import { TemplatePlaceholderMapping } from "./template_placeholders_mapping.entity";

@Entity("template_placeholders")
export class TemplatePlaceholder extends CoreEntity {
    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    description: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    source_module: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    source_table: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    source_column: string;

    @Column({
        name: "filter_key",
        type: "varchar",
        length: 255,
        nullable: false,
    })
    filter_key: string;

    // relationship
    @OneToMany(
        () => TemplatePlaceholderMapping,
        (mapping) => mapping.placeholder
    )
    templateMappings: TemplatePlaceholderMapping[];
}

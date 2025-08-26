import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from "typeorm";
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity";
import { ReservationBillingDetails } from "src/modules/master-reservation-billing-info/entities/master-reservation-billing-info.entity";
import { EmailTemplateCategory } from "./email_template_categories.entity";
import { TemplatePlaceholderMapping } from "./template_placeholders_mapping.entity";

export enum EmailTemplateType {
    Booking = "booking",
    Invoice = "invoice",
    Marketing = "marketing",
    Other = "other",
}

export enum EmailTemplateStatus {
    Active = "Active",
    Inactive = "Inactive",
}

@Entity("master_email_templates")
export class MasterEmailTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    name: string;

    @Column({ type: "varchar", length: 512, nullable: true })
    subject: string;

    @Column({ type: "text", nullable: true })
    body: string;

    @Column({ type: "enum", enum: EmailTemplateType, nullable: true })
    template_used_for: EmailTemplateType;

    @Column({ type: "varchar", length: 512, nullable: true })
    cc: string;

    @Column({ type: "varchar", length: 512, nullable: true })
    bcc: string;

    @Column({ name: "category_id", type: "int", nullable: true })
    category_id: number;

    @Column({
        type: "enum",
        enum: EmailTemplateStatus,
        default: EmailTemplateStatus.Active,
        nullable: false,
    })
    status: EmailTemplateStatus;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @Column({ type: "int", nullable: true })
    created_by: number;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @Column({ type: "int", nullable: true })
    updated_by: number;

    @DeleteDateColumn({ type: "timestamp" })
    deleted_at: Date;

    @Column({ type: "int", nullable: true })
    deleted_by: number;

    // Relationships
    @ManyToOne(() => MasterSbu, (sbu) => sbu.emailTemplates)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;

    @ManyToOne(() => EmailTemplateCategory, (category) => category.templates)
    @JoinColumn({ name: "category_id" })
    category: EmailTemplateCategory;

    @OneToMany(() => TemplatePlaceholderMapping, (mapping) => mapping.template)
    placeholderMappings: TemplatePlaceholderMapping[];

    @OneToMany(
        () => ReservationBillingDetails,
        (billingDetail) => billingDetail.checkout_email_template
    )
    billingDetailsUsingThisTemplate: ReservationBillingDetails[];
}

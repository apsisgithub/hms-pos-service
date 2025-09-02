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
import { MasterEmailTemplate } from "./master/master_email_templates.entity"; // Your existing template entity
import { TemplatePlaceholder } from "./email_template_placeholders.entity";
import { CoreEntity } from "src/utils/core-entity";

@Entity("template_placeholder_mappings")
export class TemplatePlaceholderMapping extends CoreEntity {
  @Column({ name: "template_id", type: "int", nullable: false })
  templateId: number;

  @ManyToOne(
    () => MasterEmailTemplate,
    (template) => template.placeholderMappings
  )
  @JoinColumn({ name: "template_id" })
  template: MasterEmailTemplate;

  // Foreign key to the placeholder
  @Column({ name: "placeholder_id", type: "int", nullable: false })
  placeholderId: number;

  @ManyToOne(
    () => TemplatePlaceholder,
    (placeholder) => placeholder.templateMappings
  )
  @JoinColumn({ name: "placeholder_id" })
  placeholder: TemplatePlaceholder;
}

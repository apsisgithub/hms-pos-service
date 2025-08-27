import { CoreEntity } from "src/utils/core-entity";
import { Entity, Column, OneToMany } from "typeorm";
import { MasterEmailTemplate } from "./master/master_email_templates.entity";

@Entity("email_template_categories")
export class EmailTemplateCategory extends CoreEntity {
  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int", nullable: false })
  sbu_id: number;

  @OneToMany(() => MasterEmailTemplate, (template) => template.category)
  templates: MasterEmailTemplate[];
}

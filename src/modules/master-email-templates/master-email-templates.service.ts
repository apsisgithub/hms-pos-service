import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterEmailTemplateDto } from "./dto/create-master-email-template.dto";
import { UpdateMasterEmailTemplateDto } from "./dto/update-master-email-template.dto";
import { handleError } from "src/utils/handle-error.util";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterEmailTemplate } from "./entities/master_email_templates.entity";
import { Repository } from "typeorm";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { getCurrentUser } from "src/common/utils/user.util";
import { GetEmailTemplatesDto } from "./dto/get-email-templates.dto";
import { paginationResponse } from "src/utils/pagination-response.util";

@Injectable()
export class MasterEmailTemplatesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterEmailTemplate)
        private readonly emailTemplateRepo: Repository<MasterEmailTemplate>
    ) {}

    async createEmailTemplate(dto: CreateMasterEmailTemplateDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newEmailTemplate = new MasterEmailTemplate();
            Object.assign(newEmailTemplate, dto);
            newEmailTemplate.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(
                MasterEmailTemplate,
                newEmailTemplate
            );

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-emailTemplate: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating emailTemplate");
        } finally {
            await transaction.release();
        }
    }

    async findAllEmailTemplates(dto: GetEmailTemplatesDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const emailTemplateList = await this.emailTemplateRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return emailTemplateList;
            } else {
                const [emailTemplateList, total] =
                    await this.emailTemplateRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return paginationResponse({
                    data: emailTemplateList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-emailTemplate: ", error);
            handleError(error, "while getting all emailTemplate");
        }
    }

    async findEmailTemplateById(id: number) {
        try {
            const emailTemplate = await this.emailTemplateRepo.findOne({
                where: { id },
            });
            if (!emailTemplate) {
                throw new NotFoundException("emailTemplate was not found");
            }

            return emailTemplate;
        } catch (error) {
            console.error("error in find-one-emailTemplate: ", error);
            handleError(error, "while getting emailTemplate");
        }
    }

    async updateEmailTemplate(id: number, dto: UpdateMasterEmailTemplateDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedEmailTemplate = await transaction.update(
                MasterEmailTemplate,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedEmailTemplate;
        } catch (error) {
            console.error("error in update-emailTemplate: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating emailTemplate");
        } finally {
            await transaction.release();
        }
    }

    async removeEmailTemplate(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterEmailTemplate,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `emailTemplate was deleted successfully`;
        } catch (error) {
            console.error("error in remove-emailTemplate: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting emailTemplate");
        } finally {
            await transaction.release();
        }
    }
}

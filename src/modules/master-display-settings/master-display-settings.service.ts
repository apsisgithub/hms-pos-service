import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CreateMasterDisplaySettingDto } from "./dto/create-master-display-setting.dto";
import { UpdateMasterDisplaySettingDto } from "./dto/update-master-display-setting.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterDisplaySetting } from "./entities/master_display_settings.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetDisplaySettingsDto } from "./dto/get-display-settings.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class MasterDisplaySettingsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterDisplaySetting)
        private readonly displaySettingsRepo: Repository<MasterDisplaySetting>
    ) {}

    async createDisplaySettings(dto: CreateMasterDisplaySettingDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newDisplaySetting = new MasterDisplaySetting();
            Object.assign(newDisplaySetting, dto);
            newDisplaySetting.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(
                MasterDisplaySetting,
                newDisplaySetting
            );

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-displaySettings: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating displaySettings");
        } finally {
            await transaction.release();
        }
    }

    async findAllDisplaySettings(dto: GetDisplaySettingsDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const displaySettingsList = await this.displaySettingsRepo.find(
                    {
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    }
                );
                console.log("displaySettingsList ", displaySettingsList);

                return displaySettingsList;
            } else {
                const [displaySettingsList, total] =
                    await this.displaySettingsRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });
                console.log(
                    "displaySettingsList Pagination",
                    displaySettingsList
                );

                return paginationResponse({
                    data: displaySettingsList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-displaySettings: ", error);
            handleError(error, "while getting all displaySettings");
        }
    }

    async findDisplaySettingsById(id: number) {
        try {
            const displaySettings = await this.displaySettingsRepo.findOne({
                where: { id },
            });
            if (!displaySettings) {
                throw new NotFoundException("displaySettings was not found");
            }

            return displaySettings;
        } catch (error) {
            console.error("error in find-one-displaySettings: ", error);
            handleError(error, "while getting displaySettings");
        }
    }

    async updateDisplaySettings(
        id: number,
        dto: UpdateMasterDisplaySettingDto
    ) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedDisplaySetting = await transaction.update(
                MasterDisplaySetting,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedDisplaySetting;
        } catch (error) {
            console.error("error in update-displaySettings: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating displaySettings");
        } finally {
            await transaction.release();
        }
    }

    async removeDisplaySettings(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterDisplaySetting,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `displaySettings was deleted successfully`;
        } catch (error) {
            console.error("error in remove-displaySettings: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting displaySettings");
        } finally {
            await transaction.release();
        }
    }
}

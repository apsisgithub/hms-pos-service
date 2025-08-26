import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PosMenu } from "./entities/pos-menu.entity";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { handleError } from "src/utils/handle-error.util";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class PosMenusService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(PosMenu)
        private readonly menuRepo: Repository<PosMenu>
    ) {}

    async createMenu(dto: any) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const menuData = {
                ...dto,
                created_by: Number(getCurrentUser("user_id"))
            };

            const result = await transaction.save(PosMenu, menuData);
            await transaction.commitTransaction();
            
            return result;
        } catch (error) {
            console.error("error in create-menu: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating menu");
        } finally {
            await transaction.release();
        }
    }

    async findAllMenus(dto: any) {
        try {
            const { page_number = 1, limit } = dto;
            
            const queryBuilder = this.menuRepo.createQueryBuilder('menu')
                .leftJoinAndSelect('menu.outlet', 'outlet')
                .leftJoinAndSelect('menu.unit', 'unit')
                .orderBy('menu.id', 'ASC');
        
            if (dto.outlet_id) {
                queryBuilder.where('menu.outlet_id = :outlet_id', { outlet_id: dto.outlet_id });
            }

            if (dto.search) {
                queryBuilder.andWhere('menu.item_name LIKE :search OR menu.description LIKE :search', {
                    search: `%${dto.search}%`
                });
            }

            if (dto.min_price) {
                queryBuilder.andWhere('menu.price >= :min_price', { min_price: dto.min_price });
            }

            if (dto.max_price) {
                queryBuilder.andWhere('menu.price <= :max_price', { max_price: dto.max_price });
            }

            if (limit === undefined || limit === null) {
                const menuList = await queryBuilder.getMany();

                if (menuList.length === 0) {
                    throw new NotFoundException("menu list is empty");
                }
                return menuList;
            } else {
                const [menuList, total] = await queryBuilder
                    .skip((page_number - 1) * limit)
                    .take(limit)
                    .getManyAndCount();

                if (menuList.length === 0) {
                    throw new NotFoundException("menu list is empty");
                }

                return paginationResponse({
                    data: menuList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-menus: ", error);
            handleError(error, "while getting all menus");
        }
    }

    async findMenuById(menu_id: number) {
        try {
            const menu = await this.menuRepo.findOne({
                where: { id: menu_id },
                relations: ['outlet', 'unit']
            });
            if (!menu) {
                throw new NotFoundException("menu was not found");
            }

            return menu;
        } catch (error) {
            console.error("error in find-one-menu: ", error);
            handleError(error, "while getting menu");
        }
    }

    async updateMenu(menu_id: number, dto: any) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            const updatedMenu = await transaction.update(
                PosMenu,
                { id: menu_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return updatedMenu;
        } catch (error) {
            console.error("error in update-menu: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating menu");
        } finally {
            await transaction.release();
        }
    }

    async removeMenu(menu_id: number) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                PosMenu,
                { id: menu_id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return `menu was deleted successfully`;
        } catch (error) {
            console.error("error in remove-menu: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting menu");
        } finally {
            await transaction.release();
        }
    }
}
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { HousekeepingWorkOrder, WorkOrderStatus } from "./entities/housekeeping_work_order.entity";
import { HousekeepingWorkOrderLog } from "./entities/housekeeping_work_order_log.entity";
import { CreateWorkOrderDto } from "./dto/create-work-order.dto";
import { UpdateWorkOrderDto } from "./dto/update-work-order.dto";
import { QueryManagerService } from "src/common/query-manager/query.service";

@Injectable()
export class HousekeepingService {
    constructor(
        @InjectRepository(HousekeepingWorkOrder)
        private readonly workOrderRepository: Repository<HousekeepingWorkOrder>,

        private readonly queryManagerService: QueryManagerService
    ) { }

    async createWorkOrder(createWorkOrderDto: CreateWorkOrderDto): Promise<HousekeepingWorkOrder> {
        const transaction = await this.queryManagerService.createTransaction();
        try {

            await transaction.startTransaction();

            // Check if there's already an active work order for this room
            const existingWorkOrder = await this.workOrderRepository.findOne({
                where: {
                    room_id: createWorkOrderDto.room_id,
                    status: In([WorkOrderStatus.New, WorkOrderStatus.Assigned, WorkOrderStatus.InProgress])
                }
            });

            if (existingWorkOrder) {
                throw new BadRequestException(
                    `Room ${createWorkOrderDto.room_id} already has an active work order (ID: ${existingWorkOrder.id}) with status: ${existingWorkOrder.status}`
                );
            }


            // Create and save work order
            const savedWorkOrder: any = await transaction.save(HousekeepingWorkOrder, createWorkOrderDto);

            // Create initial log entry
            const logData = {
                work_order_id: savedWorkOrder.id,
                status: createWorkOrderDto.status,
                assign_to: createWorkOrderDto.assign_to,
                remark: createWorkOrderDto.remark || "Work order created"
            };
            await transaction.save(HousekeepingWorkOrderLog, logData);

            await transaction.commitTransaction();
            return savedWorkOrder;
        } catch (error) {
            await transaction.rollbackTransaction();
            throw error;
        } finally {
            await transaction.release();
        }
    }

    async updateWorkOrder(workOrderId: number, updateWorkOrderDto: UpdateWorkOrderDto): Promise<HousekeepingWorkOrder> {
        const transaction = await this.queryManagerService.createTransaction();

        try {
            await transaction.startTransaction();

            // Update work order
            const updatedWorkOrder = await transaction.update(
                HousekeepingWorkOrder,
                { id: workOrderId },
                updateWorkOrderDto
            );

            // Create log entry for the update
            const logData = {
                work_order_id: workOrderId,
                status: updateWorkOrderDto.status || updatedWorkOrder.status,
                assign_to: updateWorkOrderDto.assign_to || updatedWorkOrder.assign_to,
                remark: updateWorkOrderDto.remark || "Work order updated"
            };
            await transaction.save(HousekeepingWorkOrderLog, logData);

            await transaction.commitTransaction();
            return updatedWorkOrder;
        } catch (error) {
            await transaction.rollbackTransaction();
            throw error;
        } finally {
            await transaction.release();
        }
    }

    async getWorkDetailsByRoomId(roomId: number): Promise<{ work_order_id: number | null }> {
        const workOrder = await this.workOrderRepository.findOne({
            where: {
                room_id: roomId,
                status: In([WorkOrderStatus.New, WorkOrderStatus.Assigned, WorkOrderStatus.InProgress])
            },
            order: { created_at: "DESC" }
        });

        return {
            work_order_id: workOrder ? workOrder.id : null,
            ...workOrder
        };
    }

    async getHousekeepingUsers(): Promise<{ id: number; name: string; role_name: string }[]> {
        const transaction = await this.queryManagerService.createTransaction();

        try {
            const query = `
                SELECT 
                    u.id,
                    u.name,
                    r.name as role_name
                FROM master_users u
                INNER JOIN master_roles r ON u.user_role_id = r.id
                WHERE LOWER(r.name) LIKE LOWER('%house%')
                AND u.status = 'Active'
                AND r.status = 'Active'
                ORDER BY u.name ASC
            `;

            const result = await transaction.query(query);
            return result;
        } finally {
            await transaction.release();
        }
    }
}
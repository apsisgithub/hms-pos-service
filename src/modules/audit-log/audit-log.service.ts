import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditLog } from "./entities/audit_log.entity";
import { CreateAuditLogDto } from "./dto/create-audit-log.dto";
import { GetAuditLogsDto } from "./dto/get-audit-logs.dto";
import { getCurrentUser } from "src/common/utils/user.util";
import { handleError } from "src/utils/handle-error.util";
import { paginationResponse } from "src/utils/pagination-response.util";

@Injectable()
export class AuditLogService {
    constructor(
        @InjectRepository(AuditLog)
        private readonly auditLogRepo: Repository<AuditLog>
    ) {}

    /**
     * Creates an audit log entry for folio operations
     * @param dto - Audit log data
     * @returns Promise<AuditLog> - Created audit log entry
     */
    async createAuditLog(dto: CreateAuditLogDto): Promise<AuditLog> {
        try {
            const newAuditLog = new AuditLog();
            Object.assign(newAuditLog, dto);
            newAuditLog.created_by = Number(getCurrentUser("user_id"));

            const savedAuditLog = await this.auditLogRepo.save(newAuditLog);
            return savedAuditLog;
        } catch (error) {
            console.error("error in create-audit-log: ", error);
            handleError(error, "while creating audit log");
        }
    }

    /**
     * Retrieves audit logs for a specific reservation
     * @param dto - Query parameters including reservation_id and pagination
     * @returns Promise<any> - Paginated audit logs
     */
    async getAuditLogsByReservation(dto: GetAuditLogsDto) {
        try {
            const {
                reservation_id,
                page_number = 1,
                limit = 20,
                room_id,
            } = dto;

            const queryBuilder = this.auditLogRepo
                .createQueryBuilder("auditLog")
                .leftJoin(
                    "master_users",
                    "user",
                    "user.id = auditLog.created_by"
                )
                .leftJoin(
                    "reservation_rooms",
                    "resRoom",
                    "resRoom.reservation_id = auditLog.reservation_id"
                )
                .where("auditLog.reservation_id = :reservation_id", {
                    reservation_id,
                })
                .orderBy("auditLog.created_at", "DESC")
                .skip((page_number - 1) * limit)
                .take(limit)
                .select(["auditLog", "user.name AS created_by_name"]);

            if (room_id) {
                queryBuilder.andWhere("resRoom.room_id = :room_id", {
                    room_id,
                });
            }

            const [auditLogs, total] = await queryBuilder.getManyAndCount();

            const rawResults = await queryBuilder.getRawMany();

            const auditLogsWithUserName = auditLogs.map((log, index) => ({
                ...log,
                created_by_name: rawResults[index]?.created_by_name || null,
            }));

            return paginationResponse({
                data: auditLogsWithUserName,
                total,
                page: page_number,
                limit,
            });
        } catch (error) {
            console.error("error in get-audit-logs-by-reservation: ", error);
            handleError(error, "while getting audit logs");
        }
    }

    /**
     * Helper method to log folio operations with standardized format
     * @param reservationId - ID of the reservation
     * @param sbuId - ID of the SBU
     * @param operationType - Type of operation (e.g., 'PAYMENT_APPLIED', 'CHARGE_CREATED')
     * @param prevState - Previous state description
     * @param afterState - After state description
     * @param ipAddress - IP address of the user (optional)
     */
    async logFolioOperation(
        reservationId: number,
        sbuId: number,
        operationType: string,
        prevState: { title?: string; description?: string },
        afterState: { title: string; description?: string },
        ipAddress?: string
    ): Promise<void> {
        try {
            const auditLogDto: CreateAuditLogDto = {
                reservation_id: reservationId,
                sbu_id: sbuId,
                prev_title: prevState.title,
                prev_description: prevState.description,
                after_title: afterState.title,
                after_description: afterState.description,
                operation_type: operationType,
                ip_address: ipAddress,
            };

            await this.createAuditLog(auditLogDto);
        } catch (error) {
            console.error("error in log-folio-operation: ", error);
            // Don't throw error to avoid breaking the main operation
        }
    }

    /**
     * Helper method to log payment operations
     */
    async logPaymentOperation(
        reservationId: number,
        sbuId: number,
        amount: number,
        paymentMode: string,
        folioNo: string,
        ipAddress?: string
    ): Promise<void> {
        await this.logFolioOperation(
            reservationId,
            sbuId,
            "PAYMENT_APPLIED",
            { title: "Payment Processing" },
            {
                title: "Payment Applied",
                description: `Payment of $${amount.toFixed(2)} applied via ${paymentMode} to folio ${folioNo}`,
            },
            ipAddress
        );
    }

    /**
     * Helper method to log charge operations
     */
    async logChargeOperation(
        reservationId: number,
        sbuId: number,
        amount: number,
        chargeType: string,
        folioNo: string,
        ipAddress?: string
    ): Promise<void> {
        await this.logFolioOperation(
            reservationId,
            sbuId,
            "CHARGE_CREATED",
            { title: "Charge Processing" },
            {
                title: "Charge Added",
                description: `Charge of $${amount.toFixed(2)} for ${chargeType} added to folio ${folioNo}`,
            },
            ipAddress
        );
    }

    /**
     * Helper method to log discount operations
     */
    async logDiscountOperation(
        reservationId: number,
        sbuId: number,
        amount: number,
        discountType: string,
        folioNo: string,
        ipAddress?: string
    ): Promise<void> {
        await this.logFolioOperation(
            reservationId,
            sbuId,
            "DISCOUNT_APPLIED",
            { title: "Discount Processing" },
            {
                title: "Discount Applied",
                description: `Discount of $${amount.toFixed(2)} for ${discountType} applied to folio ${folioNo}`,
            },
            ipAddress
        );
    }

    /**
     * Helper method to log folio cut operations
     */
    async logFolioCutOperation(
        reservationId: number,
        sbuId: number,
        originalFolioNo: string,
        newFolioNo: string,
        movedCharges: number,
        movedPayments: number,
        ipAddress?: string
    ): Promise<void> {
        await this.logFolioOperation(
            reservationId,
            sbuId,
            "FOLIO_CUT",
            {
                title: "Folio Cut Initiated",
                description: `Original folio: ${originalFolioNo}`,
            },
            {
                title: "Folio Cut Completed",
                description: `New folio ${newFolioNo} created from ${originalFolioNo}. Moved ${movedCharges} charges and ${movedPayments} payments`,
            },
            ipAddress
        );
    }

    /**
     * Helper method to log folio transfer operations
     */
    async logFolioTransferOperation(
        reservationId: number,
        sbuId: number,
        sourceFolioNo: string,
        targetFolioNo: string,
        transferAmount: number,
        ipAddress?: string
    ): Promise<void> {
        await this.logFolioOperation(
            reservationId,
            sbuId,
            "FOLIO_TRANSFER",
            {
                title: "Amount Transfer Initiated",
                description: `From folio: ${sourceFolioNo} to folio: ${targetFolioNo}`,
            },
            {
                title: "Amount Transfer Completed",
                description: `Transferred $${transferAmount.toFixed(2)} from folio ${sourceFolioNo} to folio ${targetFolioNo}`,
            },
            ipAddress
        );
    }

    /**
     * Helper method to log reservation status updates
     */
    async logStatusUpdateOperation(
        reservationId: number,
        sbuId: number,
        previousStatus: string,
        newStatus: string,
        reservationNumber?: string,
        ipAddress?: string
    ): Promise<void> {
        await this.logFolioOperation(
            reservationId,
            sbuId,
            "STATUS_UPDATE",
            {
                title: "Status Update Initiated",
                description: `Previous status: ${previousStatus}`,
            },
            {
                title: "Status Updated",
                description: `Reservation ${reservationNumber || reservationId} status changed from ${previousStatus} to ${newStatus}`,
            },
            ipAddress
        );
    }
}

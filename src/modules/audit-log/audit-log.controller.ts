import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuditLogService } from "./audit-log.service";
import { GetAuditLogsDto } from "./dto/get-audit-logs.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("Audit Logs")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("audit-logs")
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) {}

    @Get("reservation")
    getAuditLogsByReservation(@Query() dto: GetAuditLogsDto) {
        return this.auditLogService.getAuditLogsByReservation(dto);
    }
}
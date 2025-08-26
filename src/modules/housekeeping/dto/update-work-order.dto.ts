import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { WorkOrderStatus } from "../entities/housekeeping_work_order.entity";

export class UpdateWorkOrderDto {
    @ApiProperty({
        description: "Work order status",
        enum: WorkOrderStatus,
        example: WorkOrderStatus.InProgress,
        required: false
    })
    @IsOptional()
    @IsEnum(WorkOrderStatus)
    status?: WorkOrderStatus;

    @ApiProperty({
        description: "Assigned to user ID",
        example: 5,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    assign_to?: number;

    @ApiProperty({
        description: "Additional remarks",
        example: "Work in progress, expected completion by evening",
        required: false
    })
    @IsOptional()
    @IsString()
    remark?: string;
}
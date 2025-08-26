import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString, IsDateString, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { WorkOrderCategory, WorkOrderPriority, WorkOrderStatus } from "../entities/housekeeping_work_order.entity";

export class CreateWorkOrderDto {
    @ApiProperty({
        description: "Room ID",
        example: 1
    })
    @IsNumber()
    @Type(() => Number)
    room_id: number;

    @ApiProperty({
        description: "Work order description",
        example: "Clean bathroom and replace towels"
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: "Work order category",
        enum: WorkOrderCategory,
        example: WorkOrderCategory.Clean
    })
    @IsEnum(WorkOrderCategory)
    category: WorkOrderCategory;

    @ApiProperty({
        description: "Work order priority",
        enum: WorkOrderPriority,
        example: WorkOrderPriority.High
    })
    @IsEnum(WorkOrderPriority)
    priority: WorkOrderPriority;

    @ApiProperty({
        description: "Work order status",
        enum: WorkOrderStatus,
        example: WorkOrderStatus.New
    })
    @IsEnum(WorkOrderStatus)
    status: WorkOrderStatus;

    @ApiProperty({
        description: "Assigned to user ID",
        example: 5
    })
    @IsNumber()
    @Type(() => Number)
    assign_to: number;

    @ApiProperty({
        description: "Start date (YYYY-MM-DD)",
        example: "2025-08-25"
    })
    @IsDateString()
    start_date: string;

    @ApiProperty({
        description: "End date (YYYY-MM-DD)",
        example: "2025-08-26"
    })
    @IsDateString()
    end_date: string;

    @ApiProperty({
        description: "Additional remarks",
        example: "Handle with care",
        required: false
    })
    @IsOptional()
    @IsString()
    remark?: string;
}
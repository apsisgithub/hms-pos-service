import { Controller, Post, Patch, Get, Body, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { HousekeepingService } from "./housekeeping.service";
import { CreateWorkOrderDto } from "./dto/create-work-order.dto";
import { UpdateWorkOrderDto } from "./dto/update-work-order.dto";

@ApiTags("Housekeeping")
@Controller("house-keeping")
export class HousekeepingController {
    constructor(private readonly housekeepingService: HousekeepingService) {}

    @Post("add-work-order")
    @ApiOperation({ summary: "Create a new work order" })
    @ApiResponse({ status: 201, description: "Work order created successfully" })
    @ApiResponse({ status: 400, description: "Bad request" })
    async createWorkOrder(@Body() createWorkOrderDto: CreateWorkOrderDto) {
        return await this.housekeepingService.createWorkOrder(createWorkOrderDto);
    }

    @Patch(":work_order_id")
    @ApiOperation({ summary: "Update work order status, assignment, and remarks" })
    @ApiParam({ name: "work_order_id", description: "Work Order ID", type: "number" })
    @ApiResponse({ status: 200, description: "Work order updated successfully" })
    @ApiResponse({ status: 404, description: "Work order not found" })
    async updateWorkOrder(
        @Param("work_order_id", ParseIntPipe) workOrderId: number,
        @Body() updateWorkOrderDto: UpdateWorkOrderDto
    ) {
        
        return await this.housekeepingService.updateWorkOrder(workOrderId, updateWorkOrderDto);
    }

    @Get("users/housekeeping-staff")
    @ApiOperation({ summary: "Get all users with roles containing 'house' (case insensitive)" })
    @ApiResponse({ 
        status: 200, 
        description: "Housekeeping users retrieved successfully",
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    name: { type: "string", example: "John Doe" },
                    role_name: { type: "string", example: "housekeeping" }
                }
            }
        }
    })
    async getHousekeepingUsers() {
        return await this.housekeepingService.getHousekeepingUsers();
    }

    @Get(":room_id")
    @ApiOperation({ summary: "Get current work order details for a room" })
    @ApiParam({ name: "room_id", description: "Room ID", type: "number" })
    @ApiResponse({ status: 200, description: "Work order details retrieved successfully" })
    async getWorkDetails(@Param("room_id", ParseIntPipe) roomId: number) {
        return await this.housekeepingService.getWorkDetailsByRoomId(roomId);
    }
}
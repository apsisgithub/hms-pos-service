import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PosOutletsService } from "./pos-outlets.service";
import { CreatePosOutletDto } from './dto/create-pos-outlet.dto';
import { UpdatePosOutletDto } from './dto/update-pos-outlet.dto';
import { GetPosOutletsDto } from './dto/get-pos-outlets.dto';

@ApiTags('POS Outlets')
@Controller('pos-outlets')
export class PosOutletsController {
    constructor(private readonly posOutletsService: PosOutletsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new POS outlet' })
    @ApiResponse({ status: 201, description: 'Outlet created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createOutletDto: CreatePosOutletDto) {
        return this.posOutletsService.createOutlet(createOutletDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all POS outlets with optional filtering and pagination' })
    @ApiResponse({ status: 200, description: 'List of outlets retrieved successfully' })
    findAll(@Query() query: GetPosOutletsDto) {
        return this.posOutletsService.findAllOutlets(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific POS outlet by ID' })
    @ApiParam({ name: 'id', description: 'Outlet ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Outlet retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Outlet not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.posOutletsService.findOutletById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a POS outlet' })
    @ApiParam({ name: 'id', description: 'Outlet ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Outlet updated successfully' })
    @ApiResponse({ status: 404, description: 'Outlet not found' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateOutletDto: UpdatePosOutletDto) {
        return this.posOutletsService.updateOutlet(id, updateOutletDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a POS outlet' })
    @ApiParam({ name: 'id', description: 'Outlet ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Outlet deleted successfully' })
    @ApiResponse({ status: 404, description: 'Outlet not found' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.posOutletsService.removeOutlet(id);
    }
}
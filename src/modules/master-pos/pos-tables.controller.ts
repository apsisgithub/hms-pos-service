import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PosTablesService } from "./pos-tables.service";
import { CreatePosTableDto } from './dto/create-pos-table.dto';
import { UpdatePosTableDto } from './dto/update-pos-table.dto';
import { GetPosTablesDto } from './dto/get-pos-tables.dto';

@ApiTags('POS Tables')
@Controller('pos-tables')
export class PosTablesController {
    constructor(private readonly posTablesService: PosTablesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new POS table' })
    @ApiResponse({ status: 201, description: 'Table created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createTableDto: CreatePosTableDto) {
        return this.posTablesService.createTable(createTableDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all POS tables with optional filtering and pagination' })
    @ApiResponse({ status: 200, description: 'List of tables retrieved successfully' })
    findAll(@Query() query: GetPosTablesDto) {
        return this.posTablesService.findAllTables(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific POS table by ID' })
    @ApiParam({ name: 'id', description: 'Table ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Table retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Table not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.posTablesService.findTableById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a POS table' })
    @ApiParam({ name: 'id', description: 'Table ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Table updated successfully' })
    @ApiResponse({ status: 404, description: 'Table not found' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTableDto: UpdatePosTableDto) {
        return this.posTablesService.updateTable(id, updateTableDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a POS table' })
    @ApiParam({ name: 'id', description: 'Table ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Table deleted successfully' })
    @ApiResponse({ status: 404, description: 'Table not found' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.posTablesService.removeTable(id);
    }
}
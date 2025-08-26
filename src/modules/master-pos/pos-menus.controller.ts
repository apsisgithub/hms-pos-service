import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PosMenusService } from "./pos-menus.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreatePosMenuDto } from './dto/create-pos-menu.dto';
import { UpdatePosMenuDto } from './dto/update-pos-menu.dto';
import { GetPosMenusDto } from './dto/get-pos-menus.dto';

@ApiTags('POS Menus')
@Controller('pos-menus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PosMenusController {
    constructor(private readonly posMenusService: PosMenusService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new POS menu item' })
    @ApiResponse({ status: 201, description: 'Menu item created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() createMenuDto: CreatePosMenuDto) {
        return this.posMenusService.createMenu(createMenuDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all POS menu items with optional filtering and pagination' })
    @ApiResponse({ status: 200, description: 'List of menu items retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll(@Query() query: GetPosMenusDto) {
        return this.posMenusService.findAllMenus(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific POS menu item by ID' })
    @ApiParam({ name: 'id', description: 'Menu item ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Menu item retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Menu item not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.posMenusService.findMenuById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a POS menu item' })
    @ApiParam({ name: 'id', description: 'Menu item ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Menu item updated successfully' })
    @ApiResponse({ status: 404, description: 'Menu item not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuDto: UpdatePosMenuDto) {
        return this.posMenusService.updateMenu(id, updateMenuDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a POS menu item' })
    @ApiParam({ name: 'id', description: 'Menu item ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Menu item deleted successfully' })
    @ApiResponse({ status: 404, description: 'Menu item not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.posMenusService.removeMenu(id);
    }
}
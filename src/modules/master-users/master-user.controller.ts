import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from "@nestjs/common";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { CreateMasterUserDto } from "./dto/create-user.dto";
import { MasterUserService } from "./master-user.service";
import { GetUsersDto } from "./dto/get-user.dto";
import { UpdateMasterUserDto } from "./dto/update-user.dto";

@ApiTags("User")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-user")
export class MasterUserController {
    constructor(private readonly masterUserService: MasterUserService) {}

    @Post()
    create(@Body() createMasterSeasonDto: CreateMasterUserDto) {
        return this.masterUserService.createUser(createMasterSeasonDto);
    }

    @Get("/access-list")
    getUserAccessList(@Query() dto: GetUsersDto) {
        return this.masterUserService.getAccessList();
    }

    @Get()
    findAll(@Query() dto: GetUsersDto) {
        return this.masterUserService.findAllUsers(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterUserService.findUserById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterSeasonDto: UpdateMasterUserDto
    ) {
        return this.masterUserService.updateUser(+id, updateMasterSeasonDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterUserService.removeUser(+id);
    }
}

import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from "@nestjs/common";
import { UserAccessibleSbuService } from "./user-accessible-sbu.service";
import { CreateUserAccessibleSbuDto } from "./dto/create-user-accessible-sbu.dto";
import { UpdateUserAccessibleSbuDto } from "./dto/update-user-accessible-sbu.dto";
import { GetUserAccessibleSbuDto } from "./dto/get-user-accessible-sbu.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("User Accessible Sbu")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("user-accessible-sbu")
export class UserAccessibleSbuController {
    constructor(
        private readonly userAccessibleSbuService: UserAccessibleSbuService
    ) {}

    @Post()
    create(@Body() createUserAccessibleSbuDto: CreateUserAccessibleSbuDto) {
        return this.userAccessibleSbuService.create(createUserAccessibleSbuDto);
    }

    @Get()
    findAll(@Query() dto: GetUserAccessibleSbuDto) {
        return this.userAccessibleSbuService.findAll(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.userAccessibleSbuService.findOne(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateUserAccessibleSbuDto: UpdateUserAccessibleSbuDto
    ) {
        return this.userAccessibleSbuService.update(
            +id,
            updateUserAccessibleSbuDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.userAccessibleSbuService.remove(+id);
    }
}

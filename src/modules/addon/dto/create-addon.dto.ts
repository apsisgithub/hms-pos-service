import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsNumber, Min, IsString } from "class-validator";

export class CreateAddonDto {
  @ApiPropertyOptional({
    description: "Name of the addon",
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 10.5,
    description: "Price for this addon",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: "Whether addon is active (1 = Yes, 0 = No)",
  })
  @IsOptional()
  @IsInt()
  is_active: number = 0;
}

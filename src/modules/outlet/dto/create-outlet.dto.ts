import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
} from "class-validator";

export class CreateOutletDto {
  @IsInt()
  sbu_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  created_by?: number;
}

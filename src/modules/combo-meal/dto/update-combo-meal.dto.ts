import { PartialType } from '@nestjs/swagger';
import { CreateComboMealDto } from './create-combo-meal.dto';

export class UpdateComboMealDto extends PartialType(CreateComboMealDto) {}

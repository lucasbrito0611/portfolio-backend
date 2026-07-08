import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderItemDto {
  @ApiProperty({ description: 'UUID da skill', example: 'a1b2c3d4-...' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Nova posição (inteiro ≥ 0)', example: 0 })
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderSkillsDto {
  @ApiProperty({ type: [ReorderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
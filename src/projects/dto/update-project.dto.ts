// PartialType de @nestjs/swagger herda tanto as validações quanto os @ApiProperty
// do CreateProjectDto, tornando todos os campos opcionais automaticamente no Swagger
import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}


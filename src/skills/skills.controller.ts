import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ReorderSkillsDto } from './dto/reorder-skills.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('skills') // Agrupa todos os endpoints na seção "skills" da UI
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // ← Indica que este endpoint requer JWT. O botão "Authorize" na UI desbloqueia o teste
  @ApiOperation({ summary: 'Criar uma nova skill' })
  @ApiCreatedResponse({ description: 'Skill criada com sucesso.' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as skills' })
  @ApiOkResponse({ description: 'Lista de skills retornada com sucesso.' })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma skill pelo ID' })
  @ApiOkResponse({ description: 'Skill encontrada.' })
  @ApiNotFoundResponse({ description: 'Skill não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reordenar skills em lote' })
  @ApiOkResponse({ description: 'Ordem atualizada com sucesso.' })
  reorder(@Body() reorderSkillsDto: ReorderSkillsDto) {
    return this.skillsService.reorder(reorderSkillsDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar parcialmente uma skill' })
  @ApiOkResponse({ description: 'Skill atualizada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Skill não encontrada.' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma skill' })
  @ApiOkResponse({ description: 'Skill removida com sucesso.' })
  @ApiNotFoundResponse({ description: 'Skill não encontrada.' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}



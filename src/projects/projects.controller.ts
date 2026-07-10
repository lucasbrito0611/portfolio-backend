import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ReorderProjectsDto } from './dto/reorder-projects.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('projects') // Agrupa todos os endpoints na seção "projects" da UI
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo projeto' })
  @ApiCreatedResponse({ description: 'Projeto criado com sucesso.' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os projetos' })
  @ApiOkResponse({ description: 'Lista de projetos retornada com sucesso.' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um projeto pelo ID' })
  @ApiOkResponse({ description: 'Projeto encontrado.' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reordenar projetos em lote' })
  @ApiOkResponse({ description: 'Ordem atualizada com sucesso.' })
  reorder(@Body() reorderProjectsDto: ReorderProjectsDto) {
    return this.projectsService.reorder(reorderProjectsDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar parcialmente um projeto' })
  @ApiOkResponse({ description: 'Projeto atualizado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado.' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um projeto' })
  @ApiOkResponse({ description: 'Projeto removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado.' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}



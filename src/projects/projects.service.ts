import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ReorderProjectsDto } from './dto/reorder-projects.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
      const project = this.projectRepository.create(createProjectDto);
  
      return await this.projectRepository.save(project);
    }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });

    if (!project) {
      throw new NotFoundException(`Projeto com id "${id}" não encontrado`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    const updated = this.projectRepository.merge(project, updateProjectDto);

    return this.projectRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.projectRepository.delete(id);
  }

  async reorder(reorderDto: ReorderProjectsDto): Promise<void> {
    await Promise.all(
      reorderDto.items.map((item) =>
        this.projectRepository.update(item.id, { order: item.order }),
      ),
    );
  }
}

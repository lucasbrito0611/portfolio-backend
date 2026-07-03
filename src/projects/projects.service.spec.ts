import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

const mockProjectRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
};

const mockProject: Project = {
  id: 'uuid-456',
  title_pt: 'Meu Projeto',
  title_en: 'My Project',
  description_pt: 'Descrição em PT',
  description_en: 'Description in EN',
  imageUrl: 'https://example.com/project.png',
  technologies: ['React', 'NestJS'],
  siteUrl: 'https://myproject.com',
  githubUrl: 'https://github.com/lucasbrito0611/myproject',
  order: 1,
  createdAt: new Date(),
};

const createDto: CreateProjectDto = {
  title_pt: 'Meu Projeto',
  title_en: 'My Project',
  description_pt: 'Descrição em PT',
  description_en: 'Description in EN',
  imageUrl: 'https://example.com/project.png',
  technologies: ['React', 'NestJS'],
  siteUrl: 'https://myproject.com',
  githubUrl: 'https://github.com/lucasbrito0611/myproject',
  order: 1,
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------
  describe('create', () => {
    it('deve criar e retornar um projeto', async () => {
      mockProjectRepository.create.mockReturnValue(mockProject);
      mockProjectRepository.save.mockResolvedValue(mockProject);

      const result = await service.create(createDto);

      expect(mockProjectRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockProjectRepository.save).toHaveBeenCalledWith(mockProject);
      expect(result).toEqual(mockProject);
    });
  });

  // -------------------------------------------------------------------------
  // findAll
  // -------------------------------------------------------------------------
  describe('findAll', () => {
    it('deve retornar uma lista de projetos', async () => {
      const projects = [mockProject];
      mockProjectRepository.find.mockResolvedValue(projects);

      const result = await service.findAll();

      expect(mockProjectRepository.find).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });

    it('deve retornar array vazio quando não houver projetos', async () => {
      mockProjectRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // findOne
  // -------------------------------------------------------------------------
  describe('findOne', () => {
    it('deve retornar o projeto quando o id existir', async () => {
      mockProjectRepository.findOneBy.mockResolvedValue(mockProject);

      const result = await service.findOne('uuid-456');

      expect(mockProjectRepository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-456' });
      expect(result).toEqual(mockProject);
    });

    it('deve lançar NotFoundException quando o id não existir', async () => {
      mockProjectRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // -------------------------------------------------------------------------
  // update
  // -------------------------------------------------------------------------
  describe('update', () => {
    const updateDto: UpdateProjectDto = { title_pt: 'Meu Projeto Atualizado' };
    const updatedProject = { ...mockProject, title_pt: 'Meu Projeto Atualizado' };

    it('deve atualizar e retornar o projeto', async () => {
      mockProjectRepository.findOneBy.mockResolvedValue(mockProject);
      mockProjectRepository.merge.mockReturnValue(updatedProject);
      mockProjectRepository.save.mockResolvedValue(updatedProject);

      const result = await service.update('uuid-456', updateDto);

      expect(mockProjectRepository.merge).toHaveBeenCalledWith(mockProject, updateDto);
      expect(mockProjectRepository.save).toHaveBeenCalledWith(updatedProject);
      expect(result).toEqual(updatedProject);
    });

    it('deve lançar NotFoundException quando o id não existir', async () => {
      mockProjectRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('id-inexistente', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // -------------------------------------------------------------------------
  // remove
  // -------------------------------------------------------------------------
  describe('remove', () => {
    it('deve deletar o projeto sem retornar nada', async () => {
      mockProjectRepository.findOneBy.mockResolvedValue(mockProject);
      mockProjectRepository.delete.mockResolvedValue(undefined);

      await expect(service.remove('uuid-456')).resolves.toBeUndefined();

      expect(mockProjectRepository.delete).toHaveBeenCalledWith('uuid-456');
    });

    it('deve lançar NotFoundException quando o id não existir', async () => {
      mockProjectRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

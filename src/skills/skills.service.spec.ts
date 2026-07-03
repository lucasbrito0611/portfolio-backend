import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SkillsService } from './skills.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

const mockSkillRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
};

const mockSkill: Skill = {
  id: 'uuid-123',
  name: 'NestJS',
  description: 'Framework Node.js',
  imageUrl: 'https://example.com/nestjs.png',
  docUrl: 'https://docs.nestjs.com',
  className: 'devicon-nestjs-plain',
  order: 1,
  createdAt: new Date(),
};

const createDto: CreateSkillDto = {
  name: 'NestJS',
  description: 'Framework Node.js',
  imageUrl: 'https://example.com/nestjs.png',
  docUrl: 'https://docs.nestjs.com',
  className: 'devicon-nestjs-plain',
  order: 1,
};

// ---------------------------------------------------------------------------
// Suite de testes
// ---------------------------------------------------------------------------
describe('SkillsService', () => {
  let service: SkillsService;

  beforeEach(async () => {
    // Test.createTestingModule cria um módulo NestJS isolado, só para testes.
    // Substituímos o Repository real pelo nosso mock usando getRepositoryToken,
    // que é o mesmo token que o @InjectRepository(Skill) usa internamente.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: getRepositoryToken(Skill),
          useValue: mockSkillRepository,
        },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);

    // Limpa o histórico de chamadas entre cada teste para evitar interferência
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------
  describe('create', () => {
    it('deve criar e retornar um skill', async () => {
      // Configura o que cada método do mock deve retornar neste teste
      mockSkillRepository.create.mockReturnValue(mockSkill);
      mockSkillRepository.save.mockResolvedValue(mockSkill);

      const result = await service.create(createDto);

      // Verifica se os métodos foram chamados com os argumentos corretos
      expect(mockSkillRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockSkillRepository.save).toHaveBeenCalledWith(mockSkill);
      expect(result).toEqual(mockSkill);
    });
  });

  // -------------------------------------------------------------------------
  // findAll
  // -------------------------------------------------------------------------
  describe('findAll', () => {
    it('deve retornar um array de skills ordenado', async () => {
      const skills = [mockSkill];
      mockSkillRepository.find.mockResolvedValue(skills);

      const result = await service.findAll();

      expect(mockSkillRepository.find).toHaveBeenCalledWith({
        order: { order: 'ASC' },
      });
      expect(result).toEqual(skills);
    });

    it('deve retornar array vazio quando não houver skills', async () => {
      mockSkillRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // findOne
  // -------------------------------------------------------------------------
  describe('findOne', () => {
    it('deve retornar o skill quando o id existir', async () => {
      mockSkillRepository.findOneBy.mockResolvedValue(mockSkill);

      const result = await service.findOne('uuid-123');

      expect(mockSkillRepository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-123' });
      expect(result).toEqual(mockSkill);
    });

    it('deve lançar NotFoundException quando o id não existir', async () => {
      // Simula o banco não encontrando nada
      mockSkillRepository.findOneBy.mockResolvedValue(null);

      // rejects.toThrow verifica que a Promise foi rejeitada com a exceção esperada
      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // -------------------------------------------------------------------------
  // update
  // -------------------------------------------------------------------------
  describe('update', () => {
    const updateDto: UpdateSkillDto = { name: 'NestJS v2' };
    const updatedSkill = { ...mockSkill, name: 'NestJS v2' };

    it('deve atualizar e retornar o skill', async () => {
      mockSkillRepository.findOneBy.mockResolvedValue(mockSkill);
      mockSkillRepository.merge.mockReturnValue(updatedSkill);
      mockSkillRepository.save.mockResolvedValue(updatedSkill);

      const result = await service.update('uuid-123', updateDto);

      expect(mockSkillRepository.merge).toHaveBeenCalledWith(mockSkill, updateDto);
      expect(mockSkillRepository.save).toHaveBeenCalledWith(updatedSkill);
      expect(result).toEqual(updatedSkill);
    });

    it('deve lançar NotFoundException quando o id não existir', async () => {
      mockSkillRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('id-inexistente', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // -------------------------------------------------------------------------
  // remove
  // -------------------------------------------------------------------------
  describe('remove', () => {
    it('deve deletar o skill sem retornar nada', async () => {
      mockSkillRepository.findOneBy.mockResolvedValue(mockSkill);
      mockSkillRepository.delete.mockResolvedValue(undefined);

      await expect(service.remove('uuid-123')).resolves.toBeUndefined();

      expect(mockSkillRepository.delete).toHaveBeenCalledWith('uuid-123');
    });

    it('deve lançar NotFoundException quando o id não existir', async () => {
      mockSkillRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

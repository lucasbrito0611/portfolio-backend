import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(@InjectRepository(Skill) private readonly skillRepository: Repository<Skill>) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillRepository.create(createSkillDto);

    return await this.skillRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.find({
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOneBy({ id });

    if (!skill) {
      throw new NotFoundException(`Skill com id "${id}" não encontrado`);
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findOne(id);

    const updated = this.skillRepository.merge(skill, updateSkillDto);

    return this.skillRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.skillRepository.delete(id);
  }
}

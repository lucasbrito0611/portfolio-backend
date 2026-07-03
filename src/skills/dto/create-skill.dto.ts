import { IsString, IsUrl, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
    @ApiProperty({ description: 'Nome da tecnologia/skill', example: 'TypeScript' })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Descrição ou observação sobre a skill',
        example: 'Linguagem tipada que compila para JavaScript',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'URL da imagem/ícone da tecnologia',
        example: 'https://cdn.example.com/typescript.svg',
    })
    @IsUrl()
    imageUrl: string;

    @ApiProperty({
        description: 'URL da documentação oficial',
        example: 'https://www.typescriptlang.org/docs/',
    })
    @IsUrl()
    docUrl: string;

    @ApiProperty({
        description: 'Nome da classe CSS para o ícone (ex: Devicons)',
        example: 'devicon-typescript-plain',
    })
    @IsString()
    className: string;

    @ApiProperty({
        description: 'Ordem de exibição (menor = primeiro). Padrão: 0',
        example: 1,
        required: false,
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    order?: number;
}
import { IsArray, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({ description: 'Título do projeto em português', example: 'Portfólio Pessoal' })
    @IsString()
    title_pt: string;

    @ApiProperty({ description: 'Título do projeto em inglês', example: 'Personal Portfolio' })
    @IsString()
    title_en: string;

    @ApiProperty({
        description: 'Descrição do projeto em português',
        example: 'Site de portfólio com projetos e habilidades técnicas.',
    })
    @IsString()
    description_pt: string;

    @ApiProperty({
        description: 'Descrição do projeto em inglês',
        example: 'Portfolio website showcasing projects and technical skills.',
    })
    @IsString()
    description_en: string;

    @ApiProperty({
        description: 'URL da imagem de capa do projeto',
        example: 'https://cdn.example.com/portfolio-preview.png',
    })
    @IsUrl()
    imageUrl: string;

    @ApiProperty({
        description: 'Lista de tecnologias utilizadas no projeto',
        example: ['NestJS', 'TypeScript', 'PostgreSQL'],
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    technologies: string[];

    @ApiProperty({
        description: 'URL do site em produção',
        example: 'https://meuportfolio.com',
        required: false,
    })
    @IsUrl()
    @IsOptional()
    siteUrl?: string;

    @ApiProperty({
        description: 'URL do repositório no GitHub',
        example: 'https://github.com/usuario/portfolio',
        required: false,
    })
    @IsUrl()
    @IsOptional()
    githubUrl?: string;

    @ApiProperty({
        description: 'URL do repositório de backend no GitHub (quando o projeto tem dois repositórios separados)',
        example: 'https://github.com/usuario/repositorio-backend',
        required: false,
    })
    @IsUrl()
    @IsOptional()
    githubUrlBackend?: string;

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


import { IsArray, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    title_pt: string;

    @IsString()
    title_en: string;

    @IsString()
    description_pt: string;

    @IsString()
    description_en: string;

    @IsUrl()
    imageUrl: string;

    @IsArray()
    @IsString({ each: true })
    technologies: string[];

    @IsUrl()
    @IsOptional()
    siteUrl?: string;

    @IsUrl()
    @IsOptional()
    githubUrl?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    order?: number;
}

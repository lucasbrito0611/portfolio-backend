import { IsString, IsUrl, IsInt, IsOptional, Min } from 'class-validator';
export class CreateSkillDto {
    @IsString()
    name: string;
    
    @IsString()
    @IsOptional()     
    description?: string;
   
    @IsUrl()
    imageUrl: string;
   
    @IsUrl()
    docUrl: string;
   
    @IsString()
    className: string;
   
    @IsInt()
    @Min(0)
    @IsOptional()
    order?: number;
}
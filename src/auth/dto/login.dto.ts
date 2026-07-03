import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'E-mail do usuário administrador',
        example: 'admin@portfolio.com',
    })
    @IsEmail({}, { message: 'Por favor, insira um e-mail válido' })
    email: string;

    @ApiProperty({
        description: 'Senha do usuário (mínimo 6 caracteres)',
        example: 'minhasenha123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres' })
    password: string;
}


import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Por favor, insira um e-mail válido' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres' })
    password: string;
}

import {
  IsDefined,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail(undefined, { message: 'Введите корректный email' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @MaxLength(20, { message: 'Пароль должен превышать 20 символов' })
  password: string;

  @IsDefined({ message: 'Поле повтора пароля обязательно для заполнения' })
  repeatPassword: string;
}

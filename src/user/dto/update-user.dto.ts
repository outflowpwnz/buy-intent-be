import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsEmail(undefined, { message: 'Введите корректный email' })
  email: string;
}

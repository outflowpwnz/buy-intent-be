import { IsString } from 'class-validator';

export class CreateTextDto {
  @IsString({ message: 'Язык должен быть строкой' })
  lang: string;
}

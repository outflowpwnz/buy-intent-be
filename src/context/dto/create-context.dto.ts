import { IsString } from "class-validator";

export class CreateContextDto {
  @IsString({ message: 'Контекст должен содержать поле value с строковым значением' })
  value: string
}

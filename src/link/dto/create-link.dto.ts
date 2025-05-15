import { IsString } from "class-validator";

export class CreateLinkDto {
  @IsString({ message: 'Ссылка должна содержать поле url с строковым значением' })
  url: string
}

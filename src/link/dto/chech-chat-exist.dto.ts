import { IsString } from "class-validator";

export class CheckChatExistDto {
  @IsString({ message: 'Ссылка должна содержать поле url с строковым значением' })
  url: string
}

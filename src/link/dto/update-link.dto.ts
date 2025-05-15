import { IsOptional ,IsNumber, IsString } from "class-validator";

export class UpdateLinkDto {
  @IsOptional()
  @IsNumber()
  id: number | undefined

  @IsString({ message: 'Ссылка должна содержать поле url с строковым значением' })
  url: string
}

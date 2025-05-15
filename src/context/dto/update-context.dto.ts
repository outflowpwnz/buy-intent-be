import { IsOptional ,IsNumber, IsString } from "class-validator";

export class UpdateContextDto {
  @IsOptional()
  @IsNumber()
  id: number | undefined

  @IsString({ message: 'Контекст должен содержать поле value с строковым значением' })
  value: string
}

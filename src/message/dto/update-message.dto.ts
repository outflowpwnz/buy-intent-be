import { IsNumber } from "class-validator";

export class UpdateMessageDto {
  @IsNumber(undefined, { message: 'Id не указан' })
  id: number;
}

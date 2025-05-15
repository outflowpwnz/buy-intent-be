import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ESocial } from '../entities/request.entity';
import { UpdateLinkDto } from 'src/link/dto/update-link.dto';
import { UpdateContextDto } from 'src/context/dto/update-context.dto';

export class UpdateRequestDto {
  @IsNumber(undefined, { message: 'Id не указан' })
  id: number;

  @IsString({ message: 'Введите название' })
  name: string;

  @IsString({ message: 'Выберите корректную социальную сеть' })
  social: ESocial;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLinkDto)
  links: UpdateLinkDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateContextDto)
  contexts: UpdateContextDto[];
}

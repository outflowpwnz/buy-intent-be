import { IsArray, IsString, ValidateNested } from 'class-validator';
import { ESocial } from '../entities/request.entity';
import { Type } from 'class-transformer';
import { CreateLinkDto } from 'src/link/dto/create-link.dto';
import { CreateContextDto } from 'src/context/dto/create-context.dto';

export class CreateRequestDto {
  @IsString({ message: 'Введите название' })
  name: string;

  @IsString({ message: 'Выберите корректную социальную сеть' })
  social: ESocial;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  links: CreateLinkDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContextDto)
  contexts: CreateContextDto[];
}

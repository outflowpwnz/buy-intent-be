import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { TextService } from './text.service';
import { CreateTextDto } from './dto/create-text.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createTextDto: CreateTextDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/*',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: () => {
            return new BadRequestException(
              'Ошибка загрузки: файл должен быть изображением (JPEG, PNG, GIF, WEBP, BMP) и не больше 5MB!',
            );
          },
        }),
    )
    file: Express.Multer.File,
    @Request() req,
  ) {
    return this.textService.create(req.user.id, createTextDto, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findByUserId(@Request() req) {
    return this.textService.findByUserId(req.user.id);
  }
}

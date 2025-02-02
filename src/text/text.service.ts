import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateTextDto } from './dto/create-text.dto';
import { Text } from './entities/text.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class TextService {
  constructor(
    @InjectRepository(Text) private readonly textRepository: Repository<Text>,
  ) {}

  public async create(
    userId: number,
    createTextDto: CreateTextDto,
    file: Express.Multer.File,
  ) {
    const recognizedText = await this.recognizeText(
      file.buffer,
      createTextDto.lang,
    );
    const text = {
      result: recognizedText,
      lang: createTextDto.lang,
      user: { id: userId },
    };
    const savedText = await this.textRepository.save(text);
    return savedText;
  }

  public async findByUserId(userId: number) {
    return this.textRepository.findBy({ user: { id: userId } });
  }

  private async recognizeText(
    imageBuffer: Buffer,
    language: string,
  ): Promise<string> {
    try {
      const { data } = await Tesseract.recognize(imageBuffer, language);
      return data.text;
    } catch (error) {
      throw new BadGatewayException(`Ошибка распознавания: ${error.message}`);
    }
  }
}

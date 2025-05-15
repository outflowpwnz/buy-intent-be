import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { TelegramService } from 'src/telegram/telegram.service';
import { CheckChatExistDto } from './dto/chech-chat-exist.dto';

@Injectable()
export class LinkService {
  constructor(
    private readonly telegramService: TelegramService,
  ) {}

  async checkChatExist(url: string) {
    const isChatExist = await this.telegramService.checkChatExist(url);

    return { isChatExist }
  }

  create(createLinkDto: CreateLinkDto) {
    return 'This action adds a new link';
  }

  findAll() {
    return `This action returns all link`;
  }

  findOne(id: number) {
    return `This action returns a #${id} link`;
  }

  update(id: number, updateLinkDto: UpdateLinkDto) {
    return `This action updates a #${id} link`;
  }

  remove(id: number) {
    return `This action removes a #${id} link`;
  }
}

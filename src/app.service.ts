import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { RequestService } from './request/request.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly requestService: RequestService,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.telegramService.init()
      await this.requestService.init()
    } catch (e) {
      console.error('Телеграм апи или зпросы не проинициализированны')
      process.exit(1);
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}

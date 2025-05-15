import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions';
// import * as input from 'input';
import { ConfigService } from '@nestjs/config';
import { NewMessage, NewMessageEvent } from 'telegram/events';

type TEventHandlerProps = {
  chatId: number,
  chatName: string,
  handler: (event: NewMessageEvent) => Promise<void>
  eventType: NewMessage
}

@Injectable()
export class TelegramService {
  constructor(private configService: ConfigService) {}
  private client: TelegramClient;
  private eventHandlers: TEventHandlerProps[] = [];

  async init() {
    const savedSession = this.configService.get('TELEGRAM_SESSION')
    const apiId = parseInt(this.configService.get('TELEGRAM_API_ID'), 10)
    const apiHash = this.configService.get('TELEGRAM_API_HASH')
    
    const stringSession = new StringSession(savedSession);

    this.client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    // await this.client.start({
    //   phoneNumber: async () => await input.text('Phone number:'),
    //   password: async () => await input.text('Password (if 2FA):'),
    //   phoneCode: async () => await input.text('Code:'),
    //   onError: console.error,
    // });
    // fs.writeFileSync(sessionFilePath, client.session.save());

    await this.client.connect()
  }

  async checkChatExist (chatName: string) {
    try {
      const chat = await this.client.getEntity(chatName)
      return Boolean(chat)
    } catch (e) {
      return false
    }
  }

  async subscribeToChat(eventHandlerProps: Omit<TEventHandlerProps, 'eventType'>) {
    const newMessage = new NewMessage({ chats: [eventHandlerProps.chatName] })

    await this.client.invoke(
      new Api.channels.JoinChannel({
        channel: eventHandlerProps.chatName,
      })
    );

    this.client.addEventHandler(eventHandlerProps.handler, newMessage);
    this.eventHandlers.push({ ...eventHandlerProps, eventType: newMessage });
    console.log(`Subscribed to ${eventHandlerProps.chatName}`);
  }

  unsubscribeFromChat(chatId: number) {
    const eventHandlerIndex = this.eventHandlers.findIndex(((eventHandler) => eventHandler.chatId === chatId));
    if (eventHandlerIndex !== -1) {
      const eventHandler = this.eventHandlers[eventHandlerIndex]
      this.client.removeEventHandler(eventHandler.handler, eventHandler.eventType);
      console.log(`Unsubscribed from ${eventHandler.chatName}`);
    }
  }

  getClient(): TelegramClient {
    return this.client;
  }
}

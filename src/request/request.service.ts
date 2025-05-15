import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { Repository } from 'typeorm';
import { TelegramService } from 'src/telegram/telegram.service';
import { Link } from 'src/link/entities/link.entity';
import { Message } from 'src/message/entities/message.entity';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private readonly requestRepository: Repository<Request>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    private readonly telegramService: TelegramService,
    private readonly aiService: AiService,
  ) {}

  async create(userId: number, createRequestDto: CreateRequestDto) {
    const request = await this.requestRepository.save({
      user: {
        id: userId
      },
      social: createRequestDto.social,
      name: createRequestDto.name,
      links: createRequestDto.links,
      contexts: createRequestDto.contexts
    })

    const addedRequest = await this.requestRepository.findOne({ where: { id: request.id }, relations: ['links'] })

    addedRequest.links.forEach((link) => {
      void this.subscribe(request, link)
    })
    return request;

  }

  async findAll(userId: number, page: number, size: number) {
    const list = await this.requestRepository.find({
      where: { user: { id: userId } },
      skip: (page - 1) * size,
      take: size,
      relations: ['links', 'contexts'],
      select: { user: { id: true, email: true }
    }})

    return { list };
  }

  async findOne(userId: number, id: number) {
    const request = await this.requestRepository.findOne({ where: { user: { id: userId }, id }, relations: ['links', 'contexts']})

    return request
  }

  async update(userId: number, updateRequestDto: UpdateRequestDto) {
    const request = await this.requestRepository.findOne({ where: { user: { id: userId }, id: updateRequestDto.id }, relations: ['user', 'links']})
    const createdLinks = updateRequestDto.links.filter(link => !link.id).map((link) => ({...link}));
    if (!request) throw new NotFoundException('Запрос не найден')

    const savedRequest = await this.requestRepository.save(updateRequestDto)

    const updatedRequest = await this.requestRepository.findOne({ where: { id: request.id }, relations: ['links'] })

    const updatedLinkIds = updateRequestDto.links.map(link => link.id).filter(Boolean);
    const removedLinks = request.links.filter(link => !updatedLinkIds.includes(link.id));
  
    const createdLinksWithId = updatedRequest.links.filter((link) => createdLinks.some(({ url }) => url === link.url))

    createdLinksWithId.forEach((link) => {
      void this.subscribe(savedRequest, link)
    })
    removedLinks.forEach((link) => {
      void this.telegramService.unsubscribeFromChat(link.id)
    })

    return updatedRequest
  }

  async remove(userId: number, id: number) {
    const request = await this.requestRepository.findOne({ where: { user: { id: userId }, id }, relations: ['links', 'user'] })

    if (!request) throw new NotFoundException('Запрос не найден')

    request.links.forEach((link) => this.telegramService.unsubscribeFromChat(link.id))

    const result = await this.requestRepository.delete({ user: { id: userId }, id })

    return { isSuccess: !!result.affected };
  }

  private async subscribe (request: Request, link: Link) {
    const isChatExist = await this.telegramService.checkChatExist(link.url)
    if (isChatExist) {
      this.telegramService.subscribeToChat({
        chatId: link.id,
        handler: async (event) => {
          const message = event.message;
          console.log(`💬 Новый комментарий: ${message.message}`);
          const sender = await message.getSender();
          if ('username' in sender ) {
            const currentRequest = await this.requestRepository.findOne({ where: { id: request.id }, relations: ['contexts']})          
            const isMessageValid = await this.aiService.validateMessage(message.message, currentRequest)
            if (isMessageValid) {
              void this.messageRepository.save({
                isWorkedOut: false,
                userMessage: message.message,
                userMessageId: message.id,
                userName: sender.username,
                user: {
                  id: request.user.id
                },
                request: {
                  id: request.id
                },
                link: {
                  id: link.id
                }
              })
            }
          }
        },
        chatName: link.url
      })

    }
  }

  async init() {
    const request = await this.requestRepository.find({ relations: ['user', 'links', 'contexts']})

    request.forEach((request) => {
      request.links.forEach(async (link) => {
        void this.subscribe(request, link)
      })
    })
  }
}

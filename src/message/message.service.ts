import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>
  ) {}

  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }


  async findAll(userId: number, isWorkedOut: boolean, page?: string, size?: string) {
    const preparedPage = parseInt(page) || undefined
    const preparedSize = parseInt(size) || undefined
    const list = await this.messageRepository.find({
      where: {
        user: { id: userId },
        isWorkedOut
      },
      skip: preparedSize && preparedPage ? (preparedPage - 1) * preparedSize : undefined,
      take: preparedSize,
      order: {
        id: 'DESC'
      },
      relations: ['request', 'link'],
    })

    return { list };
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  async update(userId: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.messageRepository.findOne({ where: { user: { id: userId }, id: updateMessageDto.id }, relations: ['user']})
    if (!message) throw new NotFoundException('Сообщение не найдено')

    const savedRequest = await this.messageRepository.save({ ...updateMessageDto, isWorkedOut: true })
    return savedRequest
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}

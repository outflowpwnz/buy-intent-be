import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { Link } from 'src/link/entities/link.entity';
import { Message } from 'src/message/entities/message.entity';
import { AiModule } from 'src/ai/ai.module';

@Module({
  controllers: [RequestController],
  providers: [RequestService],
  imports: [TypeOrmModule.forFeature([Request, Link, Message]), AiModule],
  exports: [RequestService],
})
export class RequestModule {}

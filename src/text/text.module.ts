import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Text } from './entities/text.entity';

@Module({
  controllers: [TextController],
  imports: [TypeOrmModule.forFeature([Text])],
  providers: [TextService],
})
export class TextModule {}

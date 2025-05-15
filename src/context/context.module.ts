import { Module } from '@nestjs/common';
import { ContextService } from './context.service';
import { ContextController } from './context.controller';
import { Context } from './entities/context.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ContextController],
  providers: [ContextService],
  imports: [TypeOrmModule.forFeature([Context])],
  exports: [ContextService],
})
export class ContextModule {}


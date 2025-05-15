import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'src/request/entities/request.entity';

type TAIReponseItem = {
  label: string,
  score: number
}

type TAIReponse = TAIReponseItem[]

@Injectable()
export class AiService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  async validateMessage(message: string, request: Request) {
    try {
      const result = await this.httpService
        .post<TAIReponse>(
          this.configService.get('AI_URL'),
          { 
            context: request.contexts.map(({ value }) => value),
            text: message 
          }
        ).toPromise()

      const preparedThreshold = parseFloat(this.configService.get('AI_THRESHOLD'))
      const isValidMessage = result.data.some(({ score }) => score >= preparedThreshold)
      console.log(result.data)
      console.log(isValidMessage)
      return isValidMessage
    } catch (e) {
      console.error('validate message error', e)
      return false
    }
  }
}

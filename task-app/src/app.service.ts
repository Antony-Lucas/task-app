import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(username: string): string {
    return `Olá ${username} este é o swagger da aplicação Task-app do desafio Jack Experts`;
  }
}

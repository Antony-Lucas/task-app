import { ApiProperty } from '@nestjs/swagger';
import { Priority, Status } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Criar testes unitários' })
  title: string;
  @ApiProperty({
    example: 'Desenvolver testes para as funções da API usando AAA',
  })
  description?: string;
  @ApiProperty({ example: 'PENDING | IN_PROGRESS | COMPLETED' })
  status?: Status;
  @ApiProperty({ example: 'LOW | MEDIUM | HIGH' })
  priority?: Priority;
  @ApiProperty({ example: 1 })
  userId: number;
}

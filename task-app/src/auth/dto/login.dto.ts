import { ApiProperty } from '@nestjs/swagger';

export class loginDTO {
  @ApiProperty({ example: 'antony@email.com' })
  email: string;
  @ApiProperty({ example: 'yourpass' })
  password: string;
}

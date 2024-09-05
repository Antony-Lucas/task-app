import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  id: number;
  @ApiProperty({ example: 'Antony Lauan Lucas' })
  name: string;
  @ApiProperty({ example: 'antony.lucas' })
  username: string;
  @ApiProperty({ example: 'antony@email.com' })
  email: string;
  @ApiProperty({ example: 'yourpass' })
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

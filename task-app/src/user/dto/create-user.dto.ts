import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  id: number;
  @ApiProperty({ example: 'antony.lucas' })
  username: string;
  @ApiProperty({ example: 'yourpass' })
  password: string;
  @ApiProperty({ example: 'Antony Lauan Lucas' })
  name: string;
  @ApiProperty({ example: 'antony@email.com' })
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

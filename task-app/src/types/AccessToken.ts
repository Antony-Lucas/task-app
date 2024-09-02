import { ApiProperty } from '@nestjs/swagger';

export interface AccessToken {
  access_token: string;
}

export class refreshTokenDTO {
  @ApiProperty({ example: 'yourRefreshToken' })
  refresh_token: string;
}

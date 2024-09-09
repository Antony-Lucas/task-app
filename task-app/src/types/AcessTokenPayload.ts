export interface AccessTokenPayload {
  sub: number; // Representa o ID do usuário
  username: string; // Nome de usuário
  email?: string; // Opcional: E-mail do usuário
  iat?: number; // Timestamp de quando o token foi emitido (issued at)
  exp?: number; // Timestamp de quando o token expira (expiration)
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatUser } from 'src/utils/date.util';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return formatUser(user);
  }

  async findAll() {
    const user = await this.prisma.user.findMany({ include: { tasks: true } });
    return user.map(formatUser);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });

    return formatUser(user);
  }

  async findOneByEmail(email: string): Promise<CreateUserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return formatUser(user);
  }

  async remove(id: number) {
    await this.prisma.tasks.deleteMany({
      where: { userId: id },
    });
    const user = await this.prisma.user.delete({ where: { id } });
    return formatUser(user);
  }
}

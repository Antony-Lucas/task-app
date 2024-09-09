import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatUser } from 'src/utils/date.util';
import * as bcrypt from 'bcryptjs';

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
    const updateData: UpdateUserDto = { ...updateUserDto };
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new BadRequestException(
          'Este email já está associado a uma conta.',
        );
      }
    }

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    } else {
      delete updateData.password;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
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

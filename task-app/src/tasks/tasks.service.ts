import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatTask } from 'src/utils/date.util';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { status, ...taskData } = createTaskDto;

    //se o status for o enum de status for igual a 'COMPLETED' a propriedade completedAt assume a data atual e registra na base
    let completedAt = null;
    if (status == 'COMPLETED') {
      completedAt = new Date();
    }

    const task = await this.prisma.tasks.create({
      data: { ...taskData, status, completedAt },
    });

    return formatTask(task);
  }

  async findAll() {
    const task = await this.prisma.tasks.findMany({
      include: { user: { select: { id: true, name: true } } },
    });

    return task.map(formatTask);
  }

  async findOne(id: number) {
    const task = await this.prisma.tasks.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });

    return formatTask(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { status, ...taskData } = updateTaskDto;

    let completedAt = null;
    if (status == 'COMPLETED') {
      completedAt = new Date();
    }

    const task = await this.prisma.tasks.update({
      where: { id },
      data: { ...taskData, status, completedAt },
    });

    return formatTask(task);
  }

  async remove(id: number) {
    const task = await this.prisma.tasks.delete({ where: { id } });
    return formatTask(task);
  }
}

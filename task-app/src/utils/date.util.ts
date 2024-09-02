import * as moment from 'moment-timezone';
import 'moment/locale/pt-br';

moment.locale('pt-br');

const TIMEZONE = 'America/Sao_Paulo'; // UTC-3

export const formatDate = (date: Date | null | undefined) => {
  if (!date) return null;

  return moment(date).tz(TIMEZONE).format('D [de] MMMM YYYY [às] HH:mm'); // Formato ISO 8601 com timezone
};

export const formatTask = (task: any) => {
  return {
    ...task,
    createdAt: formatDate(task.createdAt),
    updatedAt: formatDate(task.updatedAt),
    completedAt: formatDate(task.completedAt),
  };
};

export const formatUser = (user: any) => {
  return {
    ...user,
    createdAt: formatDate(user.createdAt),
    updatedAt: formatDate(user.updatedAt),
    tasks: user.tasks ? user.tasks.map(formatTask) : [],
  };
};

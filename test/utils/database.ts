import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';

export async function refreshDatabase(app: INestApplication) {
  const sequelize = app.get(getConnectionToken());

  await sequelize.sync({ force: true, alter: true });
}

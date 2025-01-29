import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModuleAsyncOptions, SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

export const SequelizeConfig: SequelizeModuleAsyncOptions = {
  imports: [ConfigModule],

  inject: [ConfigService],

  useFactory: (configService: ConfigService): SequelizeModuleOptions => {
    return {
      dialect: configService.get<Dialect>('database.type', 'postgres'),
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      username: configService.get<string>('database.username'),
      password: configService.get<string>('database.password'),
      database: configService.get<string>('database.database'),
      autoLoadModels: true,
      synchronize: false,
      logging: false,
    };
  },
};

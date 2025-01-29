import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configurations } from './config/configurations';
import { SequelizeConfig } from './config/sequelize.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configurations],
    }),

    SequelizeModule.forRootAsync(SequelizeConfig),
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}

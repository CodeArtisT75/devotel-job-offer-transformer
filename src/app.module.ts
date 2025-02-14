import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { I18nModule } from 'nestjs-i18n';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configurations } from './config/configurations';
import { I18nConfig } from './config/i18n.config';
import { SequelizeConfig } from './config/sequelize.config';
import { HttpExceptionFilter } from './lib/filters/http-exception.filter';
import { ModelNotFoundExceptionFilter } from './lib/filters/model-not-found-exception.filter';
import { UnhandledErrorExceptionFilter } from './lib/filters/unhandled-error-exception.filter';
import { ValidationErrorExceptionFilter } from './lib/filters/validation-error-exception.filter';
import { LoggerModule } from './lib/logger';
import { JobFetchingModule } from './modules/job-fetching/job-fetching.module';
import { JobOffersModule } from './modules/job-offers/job-offers.module';

const envFilePath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFilePath, '.env'],
      load: [Configurations],
    }),

    SequelizeModule.forRootAsync(SequelizeConfig),

    ScheduleModule.forRoot(),

    I18nModule.forRoot(I18nConfig),

    LoggerModule,

    JobOffersModule,

    JobFetchingModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,

    // note that filters ordering is IMPORTANT here. do not change the order of these global filters
    {
      provide: APP_FILTER,
      useClass: UnhandledErrorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ModelNotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationErrorExceptionFilter,
    },
  ],
})
export class AppModule {}

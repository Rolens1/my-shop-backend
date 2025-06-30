import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL ? process.env.DATABASE_URL : ""),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory : (configService : ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production'

        return {
          pinoHttp: {
            transport: isProduction ? undefined : {
              target: 'pino-pretty',
              options: {
                singleLine: true
              },
            },
            level: isProduction ? 'info' : 'debug'
          }
        }
      },
      inject: [ConfigService]
    }),
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

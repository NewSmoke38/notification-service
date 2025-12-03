import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PreferencesModule } from './modules/preferences/preferences.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',

        database: ':memory:',

        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        synchronize: true, // auto create tables
      }),
    }),
    OrganizationsModule,
    NotificationsModule,
    PreferencesModule,
  ],
})
export class AppModule { }
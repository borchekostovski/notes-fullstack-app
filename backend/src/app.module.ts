import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST', 'localhost'),
        port: Number(config.get('POSTGRES_PORT', 5432)),
        username: config.get('POSTGRES_USER', 'notes'),
        password: config.get('POSTGRES_PASSWORD', 'notes'),
        database: config.get('POSTGRES_DB', 'notes'),
        autoLoadEntities: true,
        // fine for a take-home — swap to migrations before production
        synchronize: true,
      }),
    }),
    NotesModule,
  ],
})
export class AppModule {}

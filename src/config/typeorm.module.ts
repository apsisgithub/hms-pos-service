import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { DatabaseManager } from './db';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [],

      useFactory: async () => {
        const dataSource = await DatabaseManager.getInstance();
        // console.log('app.module:',dataSource.options)
        return dataSource;
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule { }

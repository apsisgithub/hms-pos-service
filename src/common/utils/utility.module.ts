import { Global, Module } from '@nestjs/common';
import { QueryManagerService } from 'src/common/query-manager/query.service';

const modules = [QueryManagerService];

@Global()
@Module({
  imports: [],
  providers: [...modules],
  exports: [...modules],
})
export class UtilityModule {}

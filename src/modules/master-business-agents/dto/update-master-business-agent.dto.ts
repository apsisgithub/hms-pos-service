import { PartialType } from '@nestjs/swagger';
import { CreateMasterBusinessAgentDto } from './create-master-business-agent.dto';

export class UpdateMasterBusinessAgentDto extends PartialType(CreateMasterBusinessAgentDto) {}

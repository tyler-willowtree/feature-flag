import { Controller, Get, Render } from '@nestjs/common';
import { FeatureFlagService } from 'server/featureFlag.service';
import { FeatureFlagSingleDbService } from 'server/featureFlagSingleDb.service';

@Controller()
export class AppController {
  constructor(
    private readonly service: FeatureFlagService,
    private readonly singleService: FeatureFlagSingleDbService
  ) {}

  @Get()
  @Render('index')
  async root() {
    const flagsOwn = await this.service.getAllFlags();
    const flagsSingle = await this.singleService.getAllFlagsSDB();
    return { flagsOwn, flagsSingle };
  }
}

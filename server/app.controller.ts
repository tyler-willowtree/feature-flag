import { Controller, Get, Render } from '@nestjs/common';
import { FeatureFlagService } from 'server/featureFlag.service';

@Controller()
export class AppController {
  constructor(private readonly service: FeatureFlagService) {}

  @Get()
  @Render('index')
  async root() {
    const flags = await this.service.getAllFlags();
    return { flags };
  }
}

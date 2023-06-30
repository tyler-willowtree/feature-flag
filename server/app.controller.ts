import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  async root() {
    return {
      exampleFlag: 'a-example-only',
      label: 'Success!',
      note: "You can remove this by toggling, or deleting the flag for 'a-example-only' on the Own Databases page",
      option: null,
    };
  }

  @Get('own')
  @Render('index')
  async own() {
    return {
      exampleFlag: 'a-example-only',
      label: 'NOTE:',
      note: "You can remove this by toggling, or deleting the flag for 'a-example-only' here",
      option: 'own',
      ownActive: 'active',
      sharedActive: '',
    };
  }

  @Get('shared')
  @Render('index')
  async shared() {
    return {
      exampleFlag: 'a-example-only',
      label: 'NOTE:',
      note: "You can remove this by toggling, or deleting the flag for 'a-example-only' on the Own Databases page",
      option: 'shared',
      ownActive: '',
      sharedActive: 'active',
    };
  }
}

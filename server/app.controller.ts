import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  async root() {
    return {
      exampleFlag: 'all-example-header',
      label: 'Success!',
      note: "You can remove this by toggling, or deleting the flag for 'all-example-header' on the Own Databases page",
    };
  }

  @Get('own')
  @Render('own')
  async own() {
    return {
      exampleFlag: 'all-example-header',
      label: 'NOTE:',
      note: "You can remove this by toggling, or deleting the flag for 'all-example-header' here",
    };
  }

  @Get('shared')
  @Render('shared')
  async shared() {
    return {
      exampleFlag: 'all-example-header',
      label: 'NOTE:',
      note: "You can remove this by toggling, or deleting the flag for 'all-example-header' on the Own Databases page",
    };
  }
}

import { Controller, Get, Render } from '@nestjs/common';
//import { AppService } from './app.service';

@Controller()
export class AppController {
  //constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(): object {
    return {
      flags: [
        { name: 'Flag 1', description: 'Description', enabled: true },
        { name: 'Flag 2', description: 'Description', enabled: false },
        { name: 'Flag 3', description: 'Description', enabled: true },
      ],
    };
  }
}

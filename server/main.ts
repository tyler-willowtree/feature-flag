import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3010;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: '*' });

  app.setBaseViewsDir(join(process.cwd(), 'server', 'views'));
  app.useStaticAssets(join(process.cwd(), 'server', 'assets'));
  app.setViewEngine('ejs');

  await app.listen(port);

  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
  console.log(`Server ready at: http://localhost:${port}/graphql`);
}
bootstrap().then();

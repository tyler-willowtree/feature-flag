import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3010;
  await app.listen(port);

  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
  console.log(`Server ready at: http://localhost:${port}/graphql`);
}
bootstrap().then();

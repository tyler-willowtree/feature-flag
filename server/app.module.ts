import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { FeatureFlagResolver } from 'server/featureFlag.resolver';
import { FeatureFlagService } from 'server/featureFlag.service';
import { FeatureFlagSingleDbResolver } from 'server/featureFlagSingleDb.resolver';
import { FeatureFlagSingleDbService } from 'server/featureFlagSingleDb.service';
import { PrismaService } from 'server/prisma.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      sortSchema: true,
      autoSchemaFile: join(
        process.cwd(),
        'server',
        'generated',
        'graphql',
        'schema.gql'
      ),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    FeatureFlagResolver,
    FeatureFlagService,
    FeatureFlagSingleDbResolver,
    FeatureFlagSingleDbService,
  ],
})
export class AppModule {}

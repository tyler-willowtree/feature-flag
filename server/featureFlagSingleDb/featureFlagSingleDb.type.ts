import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FeatureFlagSingleDb {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  localEnabled: boolean;

  @Field(() => Boolean)
  stagingEnabled: boolean;

  @Field(() => Boolean)
  productionEnabled: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@InputType()
export class FeatureFlagSingleDbToggleUniqueInput {
  @Field(() => Boolean, { nullable: true })
  localEnabled: boolean;

  @Field(() => Boolean, { nullable: true })
  stagingEnabled: boolean;

  @Field(() => Boolean, { nullable: true })
  productionEnabled: boolean;
}

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
  enabledLocal: boolean;

  @Field(() => Boolean)
  enabledStage: boolean;

  @Field(() => Boolean)
  enabledProd: boolean;

  @Field(() => Int)
  abPercentageLocal: number;

  @Field(() => Int)
  abPercentageStage: number;

  @Field(() => Int)
  abPercentageProd: number;

  @Field(() => Int)
  abShowCountLocal: number;

  @Field(() => Int)
  abHideCountLocal: number;

  @Field(() => Int)
  abShowCountStage: number;

  @Field(() => Int)
  abHideCountStage: number;

  @Field(() => Int)
  abShowCountProd: number;

  @Field(() => Int)
  abHideCountProd: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@InputType()
export class FeatureFlagSingleDbToggleUniqueInput {
  @Field(() => Boolean, { nullable: true })
  enabledLocal: boolean;

  @Field(() => Boolean, { nullable: true })
  enabledStage: boolean;

  @Field(() => Boolean, { nullable: true })
  enabledProd: boolean;
}

@InputType()
export class FeatureFlagSingleDbPercentageUpdateInput {
  @Field(() => Int, { nullable: true })
  abShowCountLocal?: number;

  @Field(() => Int, { nullable: true })
  abHideCountLocal?: number;

  @Field(() => Int, { nullable: true })
  abShowCountStage?: number;

  @Field(() => Int, { nullable: true })
  abHideCountStage?: number;

  @Field(() => Int, { nullable: true })
  abShowCountProd?: number;

  @Field(() => Int, { nullable: true })
  abHideCountProd?: number;
}

@InputType()
export class FeatureFlagSingleDbCreateInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean, { defaultValue: true })
  enabledLocal: boolean;

  @Field(() => Boolean, { defaultValue: true })
  enabledStage: boolean;

  @Field(() => Boolean, { defaultValue: true })
  enabledProd: boolean;

  @Field(() => Int, { defaultValue: 100 })
  abPercentageLocal: number;

  @Field(() => Int, { defaultValue: 100 })
  abPercentageStage: number;

  @Field(() => Int, { defaultValue: 100 })
  abPercentageProd: number;
}

@InputType()
export class FeatureFlagSingleDbUpdateInput extends FeatureFlagSingleDbCreateInput {
  @Field(() => Int)
  id: number;
}

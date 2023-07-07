import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type FeatureFlag = {
  __typename?: 'FeatureFlag';
  abHideCount: Scalars['Int']['output'];
  abPercentage: Scalars['Int']['output'];
  abShowCount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FeatureFlagCreateInput = {
  abPercentage?: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  enabled?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type FeatureFlagPercentageUpdateInput = {
  abHideCount?: InputMaybe<Scalars['Int']['input']>;
  abShowCount?: InputMaybe<Scalars['Int']['input']>;
};

export type FeatureFlagSingleDb = {
  __typename?: 'FeatureFlagSingleDb';
  abHideCountLocal: Scalars['Int']['output'];
  abHideCountProd: Scalars['Int']['output'];
  abHideCountStage: Scalars['Int']['output'];
  abPercentageLocal: Scalars['Int']['output'];
  abPercentageProd: Scalars['Int']['output'];
  abPercentageStage: Scalars['Int']['output'];
  abShowCountLocal: Scalars['Int']['output'];
  abShowCountProd: Scalars['Int']['output'];
  abShowCountStage: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  enabledLocal: Scalars['Boolean']['output'];
  enabledProd: Scalars['Boolean']['output'];
  enabledStage: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FeatureFlagSingleDbCreateInput = {
  abPercentageLocal?: Scalars['Int']['input'];
  abPercentageProd?: Scalars['Int']['input'];
  abPercentageStage?: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  enabledLocal?: Scalars['Boolean']['input'];
  enabledProd?: Scalars['Boolean']['input'];
  enabledStage?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type FeatureFlagSingleDbPercentageUpdateInput = {
  abHideCountLocal?: InputMaybe<Scalars['Int']['input']>;
  abHideCountProd?: InputMaybe<Scalars['Int']['input']>;
  abHideCountStage?: InputMaybe<Scalars['Int']['input']>;
  abShowCountLocal?: InputMaybe<Scalars['Int']['input']>;
  abShowCountProd?: InputMaybe<Scalars['Int']['input']>;
  abShowCountStage?: InputMaybe<Scalars['Int']['input']>;
};

export type FeatureFlagSingleDbToggleUniqueInput = {
  enabledLocal?: InputMaybe<Scalars['Boolean']['input']>;
  enabledProd?: InputMaybe<Scalars['Boolean']['input']>;
  enabledStage?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FeatureFlagSingleDbUpdateInput = {
  abPercentageLocal?: Scalars['Int']['input'];
  abPercentageProd?: Scalars['Int']['input'];
  abPercentageStage?: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  enabledLocal?: Scalars['Boolean']['input'];
  enabledProd?: Scalars['Boolean']['input'];
  enabledStage?: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type FeatureFlagToggleInput = {
  enabled: Scalars['Boolean']['input'];
};

export type FeatureFlagUpdateInput = {
  abPercentage?: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  enabled?: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createExampleFlag: FeatureFlag;
  createExampleFlagSDB: FeatureFlagSingleDb;
  createFlag: FeatureFlag;
  createFlagSDB: FeatureFlagSingleDb;
  deleteFlag: FeatureFlag;
  deleteFlagSDB: FeatureFlagSingleDb;
  toggleFlag: FeatureFlag;
  toggleFlagSDB: FeatureFlagSingleDb;
  updateFlag: FeatureFlag;
  updateFlagPercentage: FeatureFlag;
  updateFlagSDB: FeatureFlagSingleDb;
  updateFlagSDBPercentage: FeatureFlagSingleDb;
};


export type MutationCreateFlagArgs = {
  data: FeatureFlagCreateInput;
};


export type MutationCreateFlagSdbArgs = {
  data: FeatureFlagSingleDbCreateInput;
};


export type MutationDeleteFlagArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteFlagSdbArgs = {
  id: Scalars['Int']['input'];
};


export type MutationToggleFlagArgs = {
  data: FeatureFlagToggleInput;
  id: Scalars['Int']['input'];
};


export type MutationToggleFlagSdbArgs = {
  data: FeatureFlagSingleDbToggleUniqueInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateFlagArgs = {
  data: FeatureFlagUpdateInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateFlagPercentageArgs = {
  data: FeatureFlagPercentageUpdateInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateFlagSdbArgs = {
  data: FeatureFlagSingleDbUpdateInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateFlagSdbPercentageArgs = {
  data: FeatureFlagSingleDbPercentageUpdateInput;
  id: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAllFlags: Array<FeatureFlag>;
  getAllFlagsSDB: Array<FeatureFlagSingleDb>;
  getFlagByName?: Maybe<FeatureFlag>;
  getFlagByNameSDB?: Maybe<FeatureFlagSingleDb>;
};


export type QueryGetFlagByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetFlagByNameSdbArgs = {
  name: Scalars['String']['input'];
};

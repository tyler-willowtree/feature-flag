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
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  enablePercentage: Scalars['Int']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  offCount: Scalars['Int']['output'];
  onCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FeatureFlagCreateInput = {
  createdAt?: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  enablePercentage?: Scalars['Int']['input'];
  enabled?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  offCount?: Scalars['Int']['input'];
  onCount?: Scalars['Int']['input'];
  updatedAt?: Scalars['DateTime']['input'];
};

export type FeatureFlagPercentageUpdateInput = {
  offCount?: InputMaybe<Scalars['Int']['input']>;
  onCount?: InputMaybe<Scalars['Int']['input']>;
};

export type FeatureFlagSingleDb = {
  __typename?: 'FeatureFlagSingleDb';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  localEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  productionEnabled: Scalars['Boolean']['output'];
  stagingEnabled: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FeatureFlagSingleDbToggleUniqueInput = {
  localEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  productionEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  stagingEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FeatureFlagToggleInput = {
  enabled: Scalars['Boolean']['input'];
};

export type FeatureFlagUpdateInput = {
  createdAt?: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  enablePercentage?: Scalars['Int']['input'];
  enabled?: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  offCount?: Scalars['Int']['input'];
  onCount?: Scalars['Int']['input'];
  updatedAt?: Scalars['DateTime']['input'];
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
};


export type MutationCreateExampleFlagArgs = {
  data: FeatureFlagCreateInput;
};


export type MutationCreateExampleFlagSdbArgs = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateFlagArgs = {
  data: FeatureFlagCreateInput;
};


export type MutationCreateFlagSdbArgs = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
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
  description: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
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

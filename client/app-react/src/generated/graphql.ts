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
  enabled: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createFlag: FeatureFlag;
  deleteFlag: FeatureFlag;
  toggleFlag: FeatureFlag;
  updateFlag: FeatureFlag;
};


export type MutationCreateFlagArgs = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteFlagArgs = {
  id: Scalars['Int']['input'];
};


export type MutationToggleFlagArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateFlagArgs = {
  description: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAllFlags: Array<FeatureFlag>;
  getFlagByName?: Maybe<FeatureFlag>;
};


export type QueryGetFlagByNameArgs = {
  name: Scalars['String']['input'];
};

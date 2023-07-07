import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Mutation,
  MutationUpdateFlagPercentageArgs,
  Query,
  QueryGetFlagByNameArgs,
} from 'generated/graphql';

export const useGetAllFlags = () => {
  const { data, loading, error } = useQuery<Query>(
    gql`
      query GetAllFlags {
        getAllFlags {
          id
          name
          enabled
          abPercentage
          abShowCount
          abHideCount
        }
      }
    `,
    { fetchPolicy: 'network-only' }
  );

  return {
    flags: data?.getAllFlags,
    error,
    loading,
  };
};

export const useGetFlagByName = (name: string) => {
  const { data, loading, error } = useQuery<Query, QueryGetFlagByNameArgs>(
    gql`
      query GetFlagByName($name: String!) {
        getFlagByName(name: $name) {
          id
          name
          enabled
          abPercentage
          abShowCount
          abHideCount
        }
      }
    `,
    { fetchPolicy: 'network-only', variables: { name } }
  );

  return {
    flag: data?.getFlagByName,
    error,
    loading,
  };
};

export const useUpdateFlagCount = () => {
  const [updateFlagPercentage] = useMutation<
    Mutation,
    MutationUpdateFlagPercentageArgs
  >(
    gql`
      mutation UpdateFlagPercentage(
        $data: FeatureFlagPercentageUpdateInput!
        $id: Int!
      ) {
        updateFlagPercentage(data: $data, id: $id) {
          createdAt
          description
          abPercentage
          enabled
          id
          name
          abHideCount
          abShowCount
          updatedAt
        }
      }
    `,
    {}
  );

  return { updateFlagPercentage };
};

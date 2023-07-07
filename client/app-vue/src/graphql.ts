import { gql } from 'graphql-tag'

export const GET_FLAG_BY_NAME = gql`
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
`

export const UPDATE_FLAG_PERCENTAGE = gql`
  mutation UpdateFlagPercentage($data: FeatureFlagPercentageUpdateInput!, $id: Int!) {
    updateFlagPercentage(data: $data, id: $id) {
      id
      name
      enabled
      abPercentage
      abShowCount
      abHideCount
    }
  }
`

/**
 * Simple feature flag component using an API to keep track of flags
 * created by: Tyler Baumler (tyler.baumler@dragoninnovatus.com)
 *
 * The API requires an env variable (REACT_APP_API_URL) set in order to call the API
 *
 * To use:
 * Wrap this component around the feature providing the 'key' from the API
 *
 * Example:
 * <FlaggedFeature flagKey="spp-snackbar"><Snackbar /></FlaggedFeature>
 *
 * If a flag is set to true or does not exist in the db, the feature will not render
 * Or there is also an optional elseElement prop that can be passed in to render something
 * else if the flag is set to true
 *
 * Example:
 * <FlaggedFeature flagKey="spp-snackbar" elseElement={<div>Snackbar is disabled</div>}><Snackbar /></FlaggedFeature>
 *
 * If the flag is set to true or doesn't exist in the db, the elseElement will render
 *
 * When flag is no longer needed, ie when feature is complete, tested, and usable
 * Remove it from the DB and remove this component as the wrapper
 */

import React from 'react';
import { useGetFlagByName } from 'queries';

interface FlaggedFeatureProps {
  flagKey: string;
  children: React.ReactNode;
  elseElement?: React.ReactNode;
}

export const FlaggedFeature: React.FC<FlaggedFeatureProps> = ({
  flagKey,
  children,
  elseElement,
}) => {
  const { flag, loading, error } = useGetFlagByName(flagKey);

  if (error) return <div>{error.message}</div>;

  if (loading) return <div>Loading...</div>;

  if (!flag || flag.enabled) {
    if (elseElement) return <>{elseElement}</>;
    return null;
  }

  return <>{children}</>;
};

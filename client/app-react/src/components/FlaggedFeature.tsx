/**
 * Simple feature flag component using an API to keep track of flags
 * created by: Tyler Baumler (tyler.baumler@dragoninnovatus.com)
 *
 * The API requires an env variable (REACT_APP_API_URL) set in order to call the API
 *
 * To use:
 * Wrap this component around the feature providing the 'name' from the API
 *
 * Example:
 * <FlaggedFeature flagKey="spp-snackbar"><Snackbar /></FlaggedFeature>
 *
 * If a flag is set to true or does not exist in the db, the feature will not render
 * Or there is also an optional elseElement prop that can be passed in to render something
 * else if the flag is set to true
 *
 * Example:
 * <FlaggedFeature
 *     flagKey="spp-snackbar"
 *     elseElement={<div>Snackbar is disabled</div>}
 * >
 *   <Snackbar />
 * </FlaggedFeature>
 *
 * If the flag is set to true or doesn't exist in the db, the elseElement will render
 *
 * When flag is no longer needed, ie when feature is complete, tested, and usable
 * Remove this component as the wrapper, then after code is pushed to production, remove
 * it from the DB
 */

import { FeatureFlagPercentageUpdateInput } from 'generated/graphql';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetFlagByName, useUpdateFlagCount } from 'queries';

interface FlaggedFeatureProps {
  flagKey: string;
  ignorePercentage?: boolean;
  children: React.ReactNode;
  elseElement?: React.ReactNode;
}

enum ShowState {
  FEATURE,
  ELSE,
  NONE,
}

export const FlaggedFeature: React.FC<FlaggedFeatureProps> = ({
  flagKey,
  children,
  elseElement,
  ignorePercentage,
}) => {
  const { flag, loading, error } = useGetFlagByName(flagKey);
  const { updateFlagPercentage } = useUpdateFlagCount();
  const [showFeature, setShowFeature] = useState<ShowState>(ShowState.NONE);

  const percentComp = (
    <>
      {!ignorePercentage && flag ? (
        <div className="font16">
          A/B: {flag.enablePercentage}% ({flag.onCount} / {flag.offCount})
        </div>
      ) : null}
    </>
  );

  const updateCounts = useCallback(
    (data: FeatureFlagPercentageUpdateInput) => {
      if (flag) {
        updateFlagPercentage({
          variables: {
            id: flag.id,
            data,
          },
        });
      }
    },
    [flag]
  );

  useEffect(() => {
    if (loading) return;

    if (!flag) {
      if (elseElement) setShowFeature(ShowState.ELSE);
      else setShowFeature(ShowState.NONE);
      return;
    }

    // HAVE FLAG DATA
    if (!flag.enabled) {
      setShowFeature(ShowState.FEATURE);
      return;
    }

    // FLAG IS ENABLED
    if (ignorePercentage) {
      if (elseElement) setShowFeature(ShowState.ELSE);
      else setShowFeature(ShowState.NONE);
      return;
    }

    // USE PERCENTAGE
    if (flag.enablePercentage < 100) {
      const onOffRatio = Math.ceil(
        (flag.onCount / (flag.onCount + flag.offCount)) * 100
      );
      const enabledPercentage = flag.enablePercentage;
      const shouldShow = onOffRatio <= enabledPercentage;

      if (shouldShow) {
        updateCounts({ onCount: flag.onCount + 1 });
        setShowFeature(ShowState.FEATURE);
        return;
      }
    }

    // SHOW ELSE ELEMENT
    if (elseElement) {
      updateCounts({ offCount: flag.offCount + 1 });
      setShowFeature(ShowState.ELSE);
      return;
    }

    // SHOW NOTHING
    updateCounts({ offCount: flag.offCount + 1 });
    setShowFeature(ShowState.NONE);
  }, [loading]);

  if (error) return <div>{error.message}</div>;

  if (loading) return <div>Loading...</div>;

  if (showFeature === ShowState.NONE) return <>{percentComp}</>;

  if (showFeature === ShowState.ELSE)
    return (
      <>
        {percentComp}
        {elseElement}
      </>
    );

  return (
    <>
      {percentComp}
      {children}
    </>
  );
};

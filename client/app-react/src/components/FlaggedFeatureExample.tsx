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
 * <FlaggedFeatureExample flagKey="spp-snackbar"><Snackbar /></FlaggedFeatureExample>
 *
 * If a flag is set to true or does not exist in the db, the feature will not render
 * Or there is also an optional altElement prop that can be passed in to render something
 * else if the flag is set to true
 *
 * Example:
 * <FlaggedFeatureExample
 *     flagKey="spp-snackbar"
 *     altElement={<div>Snackbar is disabled</div>}
 * >
 *   <Snackbar />
 * </FlaggedFeatureExample>
 *
 * If the flag is set to true or doesn't exist in the db, the altElement will render
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
  altElement?: React.ReactNode;
}

enum ShowState {
  FEATURE,
  ELSE,
  NONE,
}

export const FlaggedFeatureExample: React.FC<FlaggedFeatureProps> = ({
  flagKey,
  children,
  altElement,
  ignorePercentage,
}) => {
  const { flag, loading, error } = useGetFlagByName(flagKey);
  const { updateFlagPercentage } = useUpdateFlagCount();
  const [showFeature, setShowFeature] = useState<ShowState>(ShowState.NONE);

  const percentComp = (
    <>
      {!ignorePercentage && flag ? (
        <div className="font16">
          A/B: {flag.abPercentage}% ({flag.abShowCount} / {flag.abHideCount})
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
    [flag, updateFlagPercentage]
  );

  useEffect(() => {
    if (loading) return;

    if (!flag) {
      if (altElement) setShowFeature(ShowState.ELSE);
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
      if (altElement) setShowFeature(ShowState.ELSE);
      else setShowFeature(ShowState.NONE);
      return;
    }

    // USE PERCENTAGE
    if (flag.abPercentage < 100) {
      const onOffRatio = Math.ceil(
        (flag.abShowCount / (flag.abShowCount + flag.abHideCount)) * 100
      );
      const enabledPercentage = flag.abPercentage;
      const shouldShow = onOffRatio <= enabledPercentage;

      if (shouldShow) {
        updateCounts({ abShowCount: flag.abShowCount + 1 });
        setShowFeature(ShowState.FEATURE);
        return;
      }
    }

    // SHOW ELSE ELEMENT
    if (altElement) {
      updateCounts({ abHideCount: flag.abHideCount + 1 });
      setShowFeature(ShowState.ELSE);
      return;
    }

    // SHOW NOTHING
    updateCounts({ abHideCount: flag.abHideCount + 1 });
    setShowFeature(ShowState.NONE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (error) return <div>{error.message}</div>;

  if (loading) return <div>Loading...</div>;

  if (showFeature === ShowState.NONE) return <>{percentComp}</>;

  if (showFeature === ShowState.ELSE)
    return (
      <>
        {percentComp}
        {altElement}
      </>
    );

  return (
    <>
      {percentComp}
      {children}
    </>
  );
};

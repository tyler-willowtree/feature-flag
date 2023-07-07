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
import React, { useCallback, useEffect, useState } from 'react';

/* These could be placed anywhere - START */
interface FeatureFlag {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  abPercentage: number;
  abShowCount: number;
  abHideCount: number;
  updatedAt: Date;
}
/* These could be placed anywhere - END */

interface FlaggedFeatureProps {
  flagKey: string;
  children: React.ReactNode;
  altElement?: React.ReactNode;
}

enum ShowState {
  FEATURE,
  ELSE,
  NONE,
}

export const FlaggedFeature: React.FC<FlaggedFeatureProps> = ({
  flagKey,
  children,
  altElement,
}) => {
  const [error, setError] = useState<string>();
  const [flag, setFlag] = useState<FeatureFlag>();
  const [loading, setLoading] = useState(true);
  const [showFeature, setShowFeature] = useState<ShowState>(ShowState.NONE);

  const getFlagByName = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          getFlagByName(name: "${flagKey}") {
            id
            name
            enabled
            abPercentage
            abShowCount
            abHideCount
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setFlag(res.data?.getFlagByName);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const updateFlagAbCount = useCallback(
    (data: string) => {
      fetch(`${process.env.REACT_APP_API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation updateFlagPercentage {
            updateFlagPercentage(id: ${flag?.id}, data: { ${data} }) {
              id
            }
          }`,
        }),
      }).then();
    },
    [flag]
  );

  useEffect(() => {
    getFlagByName();
  }, []);

  useEffect(() => {
    if (!flag) {
      if (altElement) setShowFeature(ShowState.ELSE);
      else setShowFeature(ShowState.NONE);
      return;
    }

    // HAVE FLAG DATA, IS NOT ENABLED, SHOW FEATURE
    // ignores the a/b percentage and just shows the feature
    if (!flag.enabled) {
      setShowFeature(ShowState.FEATURE);
      return;
    }

    // USE PERCENTAGE TO DETERMINE IF FEATURE SHOULD SHOW
    if (flag.abPercentage < 100) {
      const onOffRatio = Math.ceil(
        (flag.abShowCount / (flag.abShowCount + flag.abHideCount)) * 100
      );
      const enabledPercentage = flag.abPercentage;
      const shouldShow = onOffRatio <= enabledPercentage;

      if (shouldShow) {
        updateFlagAbCount(`abShowCount: ${flag.abShowCount + 1}`);
        setShowFeature(ShowState.FEATURE);
        return;
      }
    }

    // SHOW ELSE COMPONENT
    if (altElement) {
      updateFlagAbCount(`abHideCount: ${flag.abHideCount + 1}`);
      setShowFeature(ShowState.ELSE);
      return;
    }

    // DON'T SHOW ANYTHING
    updateFlagAbCount(`abHideCount: ${flag.abHideCount + 1}`);
    setShowFeature(ShowState.NONE);
  }, [loading]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (showFeature === ShowState.NONE) return null;

  if (showFeature === ShowState.ELSE) return <>{altElement}</>;

  return <>{children}</>;
};

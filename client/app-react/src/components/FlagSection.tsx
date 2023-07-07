import React from 'react';
import { FlaggedFeatureExample } from 'components/FlaggedFeatureExample';
import { FlaggedFeature } from 'components/FlaggedFeature';

export const FlagSection: React.FC<{
  names: string[];
  showElseElement?: boolean;
  ignorePercentage?: boolean;
}> = ({ names, showElseElement, ignorePercentage }) => {
  return (
    <div className="featureGrid">
      {names.map((flagName) => (
        <div key={flagName} className="stacked">
          <h5>Flag name: '{flagName}'</h5>

          <hr />

          {ignorePercentage ? (
            <FlaggedFeatureExample
              flagKey={flagName}
              ignorePercentage={ignorePercentage}
              altElement={showElseElement ? <div>Coming soon</div> : null}
            >
              <div className="text-center">Feature for {flagName}</div>
            </FlaggedFeatureExample>
          ) : (
            <FlaggedFeature
              flagKey={flagName}
              altElement={showElseElement ? <div>Coming soon</div> : null}
            >
              <div className="text-center">Feature for {flagName}</div>
            </FlaggedFeature>
          )}
        </div>
      ))}
    </div>
  );
};

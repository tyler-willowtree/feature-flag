import React from 'react';
import { FlaggedFeature } from './components/FlaggedFeature';

export const FlagSection: React.FC<{ names: string[] }> = ({ names }) => {
  return (
    <div className="stacked stacked-row stacked-justified-between largeRowGap">
      {names.map((flagName) => (
        <div key={flagName} className="stacked">
          <h5>Flag name: '{flagName}'</h5>

          <hr />

          <FlaggedFeature flagKey={flagName}>
            <div>Feature for {flagName}</div>
          </FlaggedFeature>
        </div>
      ))}
    </div>
  );
};

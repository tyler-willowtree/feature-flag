import React from 'react';
import { FlaggedFeature } from 'components/FlaggedFeature';

export const FlagSection: React.FC<{
  names: string[];
  showElseElement?: boolean;
}> = ({ names, showElseElement }) => {
  return (
    <div className="stacked stacked-row stacked-justified-between largeRowGap">
      {names.map((flagName) => (
        <div key={flagName} className="stacked">
          <h5>Flag name: '{flagName}'</h5>

          <hr />

          <FlaggedFeature
            flagKey={flagName}
            elseElement={showElseElement ? <div>Feature not found</div> : null}
          >
            <div>Feature for {flagName}</div>
          </FlaggedFeature>
        </div>
      ))}
    </div>
  );
};

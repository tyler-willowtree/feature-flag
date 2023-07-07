import { FlagSection } from 'components/FlagSection';
import { useGetAllFlags } from 'queries';
import React from 'react';

export const Examples: React.FC = () => {
  const { flags, error, loading } = useGetAllFlags();
  const fakeNames = ['non-exist', 'test-84', 'test-85', 'test-86'];

  return (
    <>
      <h1>Feature Flag Example (React)</h1>

      <h2>
        All available flags
        <br />
        <span>using single database option</span>
      </h2>
      {error && <div>{error.message}</div>}
      {loading && <div>Loading...</div>}
      {flags && (
        <>
          <div className="mainGrid">
            {flags &&
              flags.map((flag) => (
                <div key={flag.id} className="font16">
                  {Object.entries(flag)
                    .filter(
                      ([label]) => label !== '__typename' && label !== 'id'
                    )
                    .map(([label, value]) => (
                      <React.Fragment key={label}>
                        {label}: <code>{`${value}`}</code>
                        <br />
                      </React.Fragment>
                    ))}
                </div>
              ))}
          </div>

          <hr />

          <h2>
            ✅ Flags that are not enabled
            <br />
            <span>allow code to be used, ignores percentages by default</span>
          </h2>
          <FlagSection
            ignorePercentage
            names={flags
              .filter((flag) => !flag.enabled)
              .map((flag) => flag.name)}
          />

          <hr />

          <h2>
            ❌ Flags that are enabled
            <br />
            <span>hide code, no elseElement, ignores percentages</span>
          </h2>
          <FlagSection
            ignorePercentage
            showElseElement={false}
            names={flags
              .filter((flag) => flag.enabled)
              .map((flag) => flag.name)}
          />

          <hr />

          <h2>
            🔆 Flags that are enabled
            <br />
            <span>show elseElement, ignores percentages</span>
          </h2>
          <FlagSection
            ignorePercentage
            names={flags
              .filter((flag) => flag.enabled)
              .map((flag) => flag.name)}
            showElseElement
          />

          <hr />

          <h2>
            ❌ Flags that do not exist in the DB but are wrapped in the
            FlaggedFeature component
            <br />
            <span>hide code, no elseElement</span>
            <br />
            <span className="font16">
              This allows the feature to be started before the DB is updated
              (more useful when each environment has its own database)
            </span>
          </h2>
          <FlagSection names={fakeNames} />

          <hr />

          <h2>
            🆎 Flags that are A/B testing, enabled, and uses else element
            <br />
            <span>uses percentages to decide to show or use else/hide</span>
          </h2>
          <FlagSection
            showElseElement
            names={flags
              .filter((flag) => flag.enabled && flag.enablePercentage < 100)
              .sort((a, b) =>
                a.enablePercentage < b.enablePercentage ? 1 : -1
              )
              .map((flag) => flag.name)}
          />
        </>
      )}
    </>
  );
};

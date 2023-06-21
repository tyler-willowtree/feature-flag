import React from 'react';
import { FlagSection } from './FlagSection';
import { useGetAllFlags } from './queries';

function App() {
  const { flags, error, loading } = useGetAllFlags();
  const fakeNames = ['non-exist', 'test-84', 'test-85', 'test-86'];

  return (
    <div className="body">
      <h1>Feature Flag Example (React)</h1>

      <h2>
        All available flags <span>(uses single database option)</span>
      </h2>
      {error && <div>{error.message}</div>}
      {loading && <div>Loading...</div>}
      {flags && (
        <>
          <div className="mainGrid">
            {flags &&
              flags.map((flag) => (
                <div key={flag.id} className="font16">
                  Name: <code>{flag.name}</code>
                  <br />
                  Enabled: <code>{flag.enabled ? 'true' : 'false'}</code>
                </div>
              ))}
          </div>

          <hr />

          <h2>Flags that are not enabled (allow code to be used)</h2>
          <FlagSection
            names={flags
              .filter((flag) => !flag.enabled)
              .map((flag) => flag.name)}
          />

          <hr />

          <h2>Flags that are enabled (hide code)</h2>
          <FlagSection
            names={flags
              .filter((flag) => flag.enabled)
              .map((flag) => flag.name)}
          />

          <hr />

          <h2>Flags that are enabled (hide code, show elseElement)</h2>
          <FlagSection
            names={flags
              .filter((flag) => flag.enabled)
              .map((flag) => flag.name)}
            showElseElement
          />

          <hr />

          <h2>
            Flags that do not exist in the DB but are wrapped in the
            FlaggedFeature component (hide code)
            <br />
            <span className="font16">
              This allows the feature to be started before the DB is updated
            </span>
          </h2>
          <FlagSection names={fakeNames} />
        </>
      )}
    </div>
  );
}

export default App;

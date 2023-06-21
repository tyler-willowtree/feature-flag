import './index.css';
import './flag-section';
import './flagged-feature';
import './flag-section-detail';

const fakeNames = ['non-exist', 'test-84', 'test-85', 'test-86'];

const buildAllFlags = (flags) => {
  const parent = document.querySelector('.mainGrid');
  flags.forEach((flag) => {
    const flagElement = document.createElement('div');
    flagElement.setAttribute('class', 'font16');
    flagElement.innerHTML = `Name: <code>${flag.name}</code>
        <br />
        Enabled: <code>${flag.enabled ? 'true' : 'false'}</code>`;
    parent.appendChild(flagElement);
  });
};

const buildFlagSection = (flags, sectionName, showElse = false) => {
  const parent = document.getElementById(sectionName);
  const element = document.createElement('flag-section');
  element.setAttribute('names', flags.join(', '));
  if (showElse) {
    element.setAttribute('elseElement', 'true');
  }
  parent.after(element);
  parent.remove();
};

fetch(process.env.JS_APP_API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `{
     getAllFlags {
        id
        name
        enabled
      }
    }`,
  }),
})
  .then((res) => res.json())
  .then((result) => {
    buildAllFlags(result.data.getAllFlags);
    buildFlagSection(fakeNames, 'fake-flags');
    const enabled = result.data.getAllFlags
      .filter((flag) => flag.enabled)
      .map((flag) => flag.name);
    const disabled = result.data.getAllFlags
      .filter((flag) => !flag.enabled)
      .map((flag) => flag.name);
    buildFlagSection(enabled, 'enabled-flags');
    buildFlagSection(disabled, 'disabled-flags');
    buildFlagSection(enabled, 'enabled-flags-else', true);
  });

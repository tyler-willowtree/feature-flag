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
    const parts = [];
    Object.entries(flag).forEach(([label, value]) => {
      if (label !== '__typename' && label !== 'id') {
        parts.push(`${label}: <code>${value}</code>`);
      }
    });
    flagElement.innerHTML = parts.join('<br />');
    parent.appendChild(flagElement);
  });
};

const buildFlagSection = (flags, sectionName, showElse, ignorePercentage) => {
  const parent = document.getElementById(sectionName);
  const element = document.createElement('flag-section');
  element.setAttribute('names', flags.join(', '));
  if (showElse) {
    element.setAttribute('else-element', 'true');
  }
  element.setAttribute('ignore-percentage', `${ignorePercentage}`);
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
        abPercentage
        abShowCount
        abHideCount
      }
    }`,
  }),
})
  .then((res) => res.json())
  .then((result) => {
    buildAllFlags(result.data.getAllFlags);
    buildFlagSection(fakeNames, 'fake-flags', false, true);
    const enabled = result.data.getAllFlags
      .filter((flag) => flag.enabled)
      .map((flag) => flag.name);
    const disabled = result.data.getAllFlags
      .filter((flag) => !flag.enabled)
      .map((flag) => flag.name);
    const ab = result.data.getAllFlags
      .filter((flag) => flag.enabled && flag.abPercentage < 100)
      .sort((a, b) => (a.abPercentage < b.abPercentage ? 1 : -1))
      .map((flag) => flag.name);
    buildFlagSection(enabled, 'enabled-flags', false, true);
    buildFlagSection(disabled, 'disabled-flags', false, true);
    buildFlagSection(enabled, 'enabled-flags-else', true, true);

    buildFlagSection(ab, 'ab-testing', true, false);
  });

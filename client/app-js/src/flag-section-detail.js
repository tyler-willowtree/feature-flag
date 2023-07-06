customElements.define(
  'flag-section-detail',
  class extends HTMLElement {
    connectedCallback() {
      const showElse = Boolean(this.getAttribute('else-element'));
      const ignorePercentage = this.getAttribute('ignore-percentage');
      const name = this.getAttribute('name');
      this.innerHTML = `<div class='stacked'>
        <h5>Flag name: '${name}'</h5>
        <hr/>
        <flagged-feature flag-key="${name}" ignore-percentage="${ignorePercentage}" class='text-center'>
          <div slot="feature">Feature for ${name}</div>
          ${showElse ? '<div slot="elseElement">Coming soon</div> ' : ''}
        </flagged-feature
      </div>`;
    }
  }
);

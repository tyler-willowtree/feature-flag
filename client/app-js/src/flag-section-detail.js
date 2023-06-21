customElements.define(
  'flag-section-detail',
  class extends HTMLElement {
    connectedCallback() {
      const showElse = Boolean(this.getAttribute('elseElement'));
      const name = this.getAttribute('name');
      this.innerHTML = `<div class='stacked'>
        <h5>Flag name: '${name}'</h5>
        <hr/>
        <flagged-feature flag-key="${name}">
          <div slot="feature">Feature for ${name}</div>
          ${showElse ? '<div slot="elseElement">Feature not found</div> ' : ''}
        </flagged-feature
      </div>`;
    }
  }
);

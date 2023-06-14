customElements.define(
  'flag-section-detail',
  class extends HTMLElement {
    connectedCallback() {
      const name = this.getAttribute('name');
      this.innerHTML = `<div class='stacked'>
        <h5>Flag name: '${name}'</h5>
        <hr/>
        <flagged-feature flag-key="${name}">
          <div>For feature ${name}</div>
        </flagged-feature
      </div>`;
    }
  }
);

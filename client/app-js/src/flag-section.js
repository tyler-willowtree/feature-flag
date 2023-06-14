customElements.define(
  'flag-section',
  class extends HTMLElement {
    connectedCallback() {
      this.setAttribute(
        'class',
        'stacked stacked-row stacked-justified-between largeRowGap'
      );

      const names = this.getAttribute('names').split(', ');
      names.forEach((name) => {
        const element = document.createElement('flag-section-detail');
        element.setAttribute('name', name);
        this.appendChild(element);
      });
    }
  }
);

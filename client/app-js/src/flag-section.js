customElements.define(
  'flag-section',
  class extends HTMLElement {
    connectedCallback() {
      this.setAttribute(
        'class',
        'stacked stacked-row stacked-justified-between largeRowGap'
      );

      const showElse = Boolean(this.getAttribute('elseElement'));
      const names = this.getAttribute('names').split(', ');
      names.forEach((name) => {
        const element = document.createElement('flag-section-detail');
        element.setAttribute('name', name);
        if (showElse) {
          element.setAttribute('elseElement', 'true');
        }
        this.appendChild(element);
      });
    }
  }
);

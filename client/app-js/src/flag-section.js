customElements.define(
  'flag-section',
  class extends HTMLElement {
    connectedCallback() {
      this.setAttribute('class', 'featureGrid');

      const showElse = Boolean(this.getAttribute('else-element'));
      const ignorePercentage = this.getAttribute('ignore-percentage');
      const names = this.getAttribute('names').split(', ');
      names.forEach((name) => {
        const element = document.createElement('flag-section-detail');
        element.setAttribute('name', name);
        element.setAttribute('ignore-percentage', ignorePercentage);
        if (showElse) {
          element.setAttribute('else-element', 'true');
        }
        this.appendChild(element);
      });
    }
  }
);

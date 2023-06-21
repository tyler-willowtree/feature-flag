customElements.define(
  'flagged-feature',
  class extends HTMLElement {
    connectedCallback() {
      const flag = this.getAttribute('flag-key');

      return new Promise(() => {
        fetch(process.env.JS_APP_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `{
              getFlagByName(name: "${flag}") {
                id
                name
                enabled
              }
            }`,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (
              result.data.getFlagByName &&
              !result.data.getFlagByName.enabled
            ) {
              this.innerHTML = this.querySelector('[slot="feature"]').innerHTML;
            } else {
              const elseElement = this.querySelector('[slot="elseElement"]');
              if (elseElement) {
                this.innerHTML = elseElement.innerHTML;
              } else {
                this.remove();
              }
            }
          })
          .catch((err) => {
            this.innerHTML = `<p>Something went wrong (${err})</p>`;
          });
      });
    }
  }
);

const template = document.createElement('template');
template.innerHTML = '<slot name="feature"></slot>';

customElements.define(
  'flagged-feature',
  class extends HTMLElement {
    connectedCallback() {
      this.apiCall();
    }

    apiCall() {
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
              result.data.getFlagByName.enabled
            ) {
              this.setup();
            } else {
              this.innerHTML = '';
              this.remove();
            }
          })
          .catch((err) => {
            this.innerHTML = `<p>Something went wrong (${err})</p>`;
          });
      });
    }

    setup() {
      this.appendChild(template.content.cloneNode(true));
    }
  }
);

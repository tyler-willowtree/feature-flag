customElements.define(
  'flagged-feature',
  class extends HTMLElement {
    connectedCallback() {
      const flag = this.getAttribute('flag-key');
      if (flag) {
        return new Promise(() => {
          fetch('/graphql', {
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
                this.innerHTML =
                  this.querySelector('[slot="feature"]').innerHTML;
              } else {
                const altElement = this.querySelector('[slot="altElement"]');
                if (altElement) {
                  this.innerHTML = altElement.innerHTML;
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
  }
);

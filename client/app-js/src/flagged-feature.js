customElements.define(
  'flagged-feature',
  class extends HTMLElement {
    connectedCallback() {
      const percentageIgnore = this.getAttribute('ignore-percentage');
      const ignorePercentage = JSON.parse(percentageIgnore);
      const featureElement = this.querySelector('[slot="feature"]');
      const elseElement = this.querySelector('[slot="elseElement"]');

      this.getFlagData()
        .then((flag) => {
          // NO FLAG DATA
          if (!flag) {
            elseElement
              ? (this.innerHTML = elseElement.innerHTML)
              : this.remove();
            return;
          }

          // HAVE FLAG DATA
          if (!flag.enabled) {
            this.innerHTML = featureElement.innerHTML;
            return;
          }

          // FLAG IS ENABLED
          // ignore percentage
          if (ignorePercentage) {
            elseElement
              ? (this.innerHTML = elseElement.innerHTML)
              : this.remove();
            return;
          }

          // USE PERCENTAGE
          const abHtml = !ignorePercentage
            ? `<div class="font16">A/B: ${flag.enablePercentage}% (${flag.onCount} / ${flag.offCount})</div>`
            : '';

          if (flag.enablePercentage < 100) {
            const onOffRatio = Math.ceil(
              (flag.onCount / (flag.onCount + flag.offCount)) * 100
            );
            const enabledPercentage = flag.enablePercentage;
            const shouldShow = onOffRatio <= enabledPercentage;

            if (shouldShow) {
              this.updateFlagCount(
                flag.id,
                `onCount: ${flag.onCount + 1}`
              ).then();
              this.innerHTML = `${abHtml}${featureElement.innerHTML}`;
              return;
            }
          }

          // SHOW ELSE
          if (elseElement) {
            this.updateFlagCount(
              flag.id,
              `offCount: ${flag.offCount + 1}`
            ).then();
            this.innerHTML = `${abHtml}${elseElement.innerHTML}`;
            return;
          }

          this.updateFlagCount(
            flag.id,
            `offCount: ${flag.offCount + 1}`
          ).then();
          this.remove();
        })
        .catch((err) => {
          this.innerHTML = `<p>Something went wrong</p><p>(${err})</p>`;
        });
    }

    async updateFlagCount(id, variable) {
      const data = await fetch(process.env.JS_APP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation updateFlagPercentage {
            updateFlagPercentage(id: ${id}, data: { ${variable} }) {
              id
              name
              enabled
              enablePercentage
              onCount
              offCount
            }
          }`,
        }),
      });

      const result = await data.json();
      const flag = result.data.updateFlagPercentage;
      const hasString = this.querySelector('.ab-string');
      if (hasString) {
        hasString.innerHTML = `A/B: ${flag.enablePercentage}% (${flag.onCount} / ${flag.offCount})`;
      }
    }

    async getFlagData() {
      const flagName = this.getAttribute('flag-key');

      const data = await fetch(process.env.JS_APP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `{
              getFlagByName(name: "${flagName}") {
                id
                name
                enabled
                enablePercentage
                onCount
                offCount
              }
            }`,
        }),
      });

      const result = await data.json();
      return result.data.getFlagByName;
    }
  }
);

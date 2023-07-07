customElements.define(
  'flagged-feature-example',
  class extends HTMLElement {
    connectedCallback() {
      const percentageIgnore = this.getAttribute('ignore-percentage');
      const ignorePercentage = JSON.parse(percentageIgnore);
      const featureElement = this.querySelector('[slot="feature"]');
      const altElement = this.querySelector('[slot="altElement"]');

      this.getFlagData()
        .then((flag) => {
          // NO FLAG DATA
          if (!flag) {
            altElement
              ? (this.innerHTML = altElement.innerHTML)
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
            altElement
              ? (this.innerHTML = altElement.innerHTML)
              : this.remove();
            return;
          }

          // USE PERCENTAGE
          const abHtml = !ignorePercentage
            ? `<div class="font16">A/B: ${flag.abPercentage}% (${flag.abShowCount} / ${flag.abHideCount})</div>`
            : '';

          if (flag.abPercentage < 100) {
            const onOffRatio = Math.ceil(
              (flag.abShowCount / (flag.abShowCount + flag.abHideCount)) * 100
            );
            const enabledPercentage = flag.abPercentage;
            const shouldShow = onOffRatio <= enabledPercentage;

            if (shouldShow) {
              this.updateFlagCount(
                flag.id,
                `abShowCount: ${flag.abShowCount + 1}`
              ).then();
              this.innerHTML = `${abHtml}${featureElement.innerHTML}`;
              return;
            }
          }

          // SHOW ELSE
          if (altElement) {
            this.updateFlagCount(
              flag.id,
              `abHideCount: ${flag.abHideCount + 1}`
            ).then();
            this.innerHTML = `${abHtml}${altElement.innerHTML}`;
            return;
          }

          this.updateFlagCount(
            flag.id,
            `abHideCount: ${flag.abHideCount + 1}`
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
              abPercentage
              abShowCount
              abHideCount
            }
          }`,
        }),
      });

      const result = await data.json();
      const flag = result.data.updateFlagPercentage;
      const hasString = this.querySelector('.ab-string');
      if (hasString) {
        hasString.innerHTML = `A/B: ${flag.abPercentage}% (${flag.abShowCount} / ${flag.abHideCount})`;
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
                abPercentage
                abShowCount
                abHideCount
              }
            }`,
        }),
      });

      const result = await data.json();
      return result.data.getFlagByName;
    }
  }
);

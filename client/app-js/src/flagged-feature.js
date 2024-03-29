/**
 * Simple feature flag component using an API to keep track of flags
 * created by: Tyler Baumler (tyler.baumler@dragoninnovatus.com)
 *
 * The API requires an env variable (JS_APP_API_URL) set in order to call the API
 *
 * To use:
 * Wrap this component around the feature providing the 'name' from the API
 *
 * Example:
 * <flagged-feature flagKey="spp-snackbar"><div>Snackbar</div></flagged-feature>
 *
 * If a flag is set to true or does not exist in the db, the feature will not render
 * Or there is also an optional altElement prop that can be passed in to render something
 * else if the flag is set to true
 *
 * Example:
 * <flagged-feature
 *     flag-key="spp-snackbar"
 * >
 *   <div slot="feature">Snackbar</div>
 *   <div slot="elesElement">Snackbar is disabled</div>
 * </flagged-feature>
 *
 * If the flag is set to true or doesn't exist in the db, the altElement will render
 *
 * When flag is no longer needed, ie when feature is complete, tested, and usable
 * Remove this component as the wrapper, then after code is pushed to production, remove
 * it from the DB
 */
customElements.define(
  'flagged-feature',
  class extends HTMLElement {
    connectedCallback() {
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

          // HAVE FLAG DATA, IS NOT ENABLED, SHOW FEATURE
          // ignores the a/b percentage and just shows the feature
          if (!flag.enabled) {
            this.innerHTML = featureElement.innerHTML;
            return;
          }

          // USE PERCENTAGE TO DETERMINE IF FEATURE SHOULD SHOW
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
              );
              this.innerHTML = featureElement.innerHTML;
              return;
            }
          }

          // SHOW ELSE COMPONENT
          if (altElement) {
            this.updateFlagCount(
              flag.id,
              `abHideCount: ${flag.abHideCount + 1}`
            );
            this.innerHTML = altElement.innerHTML;
            return;
          }

          // DON'T SHOW ANYTHING
          this.updateFlagCount(flag.id, `abHideCount: ${flag.abHideCount + 1}`);
          this.remove();
        })
        .catch((err) => {
          this.innerHTML = `<p>Something went wrong</p><p>(${err})</p>`;
        });
    }

    updateFlagCount(id, data) {
      fetch(process.env.JS_APP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation updateFlagPercentage {
            updateFlagPercentage(id: ${id}, data: { ${data} }) {
              id
            }
          }`,
        }),
      }).then();
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

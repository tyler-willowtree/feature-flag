class CustomTableHead extends HTMLTableSectionElement {
  constructor() {
    super();
  }

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}

  adoptedCallback() {}

  static get observedAttributes() {
    return [];
  }
}

class CustomTableBody extends HTMLTableSectionElement {
  constructor() {
    super();
  }

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}

  adoptedCallback() {}

  static get observedAttributes() {
    return [];
  }
}

class CustomTablePagination extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}

  adoptedCallback() {}

  static get observedAttributes() {
    return [];
  }
}

class CustomFlagForm extends HTMLFormElement {
  constructor() {
    super();
  }

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}

  adoptedCallback() {}

  static get observedAttributes() {
    return [];
  }
}

customElements.define('custom-table-head', CustomTableHead, {
  extends: 'thead',
});
customElements.define('custom-table-body', CustomTableBody, {
  extends: 'tbody',
});
customElements.define('custom-table-pagination', CustomTablePagination, {
  extends: 'div',
});
customElements.define('custom-flag-form', CustomFlagForm, { extends: 'form' });

const updateTableHead = (element) => {};

const updateTableBody = (element) => {};

const updateTablePagination = (element) => {};

const updateFlagForm = (element) => {};

class CustomTableHead extends HTMLTableSectionElement {
  constructor() {
    super();
  }

  connectedCallback() {
    updateTableHead(this);
  }

  attributeChangedCallback() {
    updateTableHead(this);
  }

  static get observedAttributes() {
    return ['columns', 'sort-by', 'sort-direction'];
  }
}

customElements.define('custom-table-head', CustomTableHead, {
  extends: 'thead',
});

const updateTableHead = (element) => {
  const columns = element.getAttribute('columns');
  const sortBy = element.getAttribute('sort-by');
  const sortDirection = element.getAttribute('sort-direction');
  if (!columns || !sortBy || !sortDirection) return;

  element.innerHTML = '';
  const columnsArray = JSON.parse(columns);

  const tr = document.createElement('tr');
  const ths = columnsArray.map((column) => {
    const th = document.createElement('th');
    th.setAttribute('data-id', column.id);

    if (column.classList) {
      th.classList.add(...column.classList);
    }

    if (column.sortable) {
      th.setAttribute('data-type', column.type);
      th.classList.add('sortable');
      th.addEventListener('click', () => {
        dbClass.handleSortClick(column.id);
      });
    }
    if (sortBy === column.id) {
      th.setAttribute('data-direction', `${sortDirection}`);
    }

    const div = document.createElement('div');
    div.textContent = column.label;
    if (column.divClassList) {
      div.classList.add(...column.divClassList);
    }

    th.append(div);

    return th;
  });
  tr.append(...ths);
  element.append(tr);
};

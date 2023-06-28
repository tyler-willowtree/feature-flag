class CustomTableBody extends HTMLTableSectionElement {
  constructor() {
    super();
  }

  connectedCallback() {
    updateTableBody(this);
  }

  attributeChangedCallback() {
    updateTableBody(this);
  }

  static get observedAttributes() {
    return ['rows', 'row-options', 'col-options'];
  }
}

customElements.define('custom-table-body', CustomTableBody, {
  extends: 'tbody',
});

const updateTableBody = (element) => {
  const rows = element.getAttribute('rows');
  const rowOptions = element.getAttribute('row-options');
  const colOptions = element.getAttribute('col-options');
  if (!rowOptions || !rows || !colOptions) return;

  element.innerHTML = '';
  const colOptionsArray = JSON.parse(colOptions);
  const rowOptionsArray = JSON.parse(rowOptions);
  const rowsArray = JSON.parse(rows);

  rowsArray.forEach((row) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-row', row.id);
    colOptionsArray.forEach((option, index) => {
      tr.append(
        dbClass.createTableRowCell(
          {
            row: row,
            rowOpt: rowOptionsArray[index],
            cellData: row[option.id],
          },
          option.id === 'actions'
        )
      );
    });

    element.append(tr);
  });
};

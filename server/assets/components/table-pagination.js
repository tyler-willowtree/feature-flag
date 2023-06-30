class CustomTablePagination extends HTMLDivElement {
  constructor() {
    super();
  }

  connectedCallback() {
    updateTablePagination(this);
  }

  attributeChangedCallback() {
    updateTablePagination(this);
  }

  static get observedAttributes() {
    return [
      'current-page',
      'total-pages',
      'total-rows',
      'showing-start',
      'showing-end',
    ];
  }
}

customElements.define('custom-table-pagination', CustomTablePagination, {
  extends: 'div',
});

const updateTablePagination = (element) => {
  const currentPage = element.getAttribute('current-page');
  const totalPages = element.getAttribute('total-pages');
  const totalRows = element.getAttribute('total-rows');
  const showFrom = element.getAttribute('showing-start');
  const showTo = element.getAttribute('showing-end');

  if (
    !currentPage ||
    !totalPages ||
    !totalRows ||
    !showFrom ||
    !showTo ||
    Number(totalRows) === 0
  ) {
    element.innerHTML = '';
    return;
  }
  element.innerHTML = '';

  const perPage = dbClass.createPerPageInput();

  const leftSide = document.createElement('div');
  leftSide.classList.add('me-auto', 'me-5');
  if (showFrom === showTo) {
    leftSide.innerHTML = `Showing ${showFrom} of ${totalRows}`;
  } else {
    leftSide.innerHTML = `Showing ${showFrom}-${showTo} of ${totalRows}`;
  }

  const rightSide = document.createElement('div');
  rightSide.classList.add('ms-auto', 'd-flex', 'align-items-center');

  const span = document.createElement('span');
  span.classList.add('mx-3');
  span.innerHTML = `${currentPage} of ${totalPages}`;

  const prevButton = dbClass.createPaginationButton('prev');
  const nextButton = dbClass.createPaginationButton('next');
  rightSide.append(prevButton, span, nextButton);

  element.append(leftSide, perPage, rightSide);
};

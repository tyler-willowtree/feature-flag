/* This file is at the bottom of the html body tag */
/* It requires the body to be in the DOM before it runs */

/** -- Initial paint -- */
const str = window.flags.replaceAll('&#34;', '"');
const flags = JSON.parse(str);
const allFlags = [];
flags
  .sort((a, b) => (a.enabled ? -1 : 1))
  .forEach((flag) => {
    allFlags.push(createRow(flag));
  });

document.getElementById('flags').innerHTML = allFlags.join('');

/** -- Variables -- */
const table = document.querySelector('table');
const tableHeaders = table.querySelectorAll('th:not([data-type="exclude"])');
const tableBody = table.querySelector('tbody');
const tableRows = tableBody.querySelectorAll('tr');

/** -- Sorting -- */
const directions = Array.from(tableHeaders).map((header) => {
  return '';
});

const transformData = (index, data) => {
  const type = tableHeaders[index].dataset.type;

  switch (type) {
    case 'number':
      return Number(data);
    case 'boolean':
      return data.includes('notEnabled');
    case 'date':
      return new Date(data);
    default:
      return data;
  }
};

const sortColumn = (index) => {
  const direction = directions[index] || 'asc';
  const multiplier = direction === 'asc' ? 1 : -1;

  const clonedRows = Array.from(tableRows);

  clonedRows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[index].innerHTML;
    const cellB = rowB.querySelectorAll('td')[index].innerHTML;

    const a = transformData(index, cellA);
    const b = transformData(index, cellB);

    switch (true) {
      case a > b:
        return 1 * multiplier;
      case a < b:
        return -1 * multiplier;
      case a === b:
        return 0;
    }
  });

  // remove current rows
  [].forEach.call(tableRows, (row) => {
    tableBody.removeChild(row);
  });

  directions[index] = direction === 'asc' ? 'desc' : 'asc';

  // add new rows
  clonedRows.forEach((row) => {
    tableBody.appendChild(row);
  });
};

/** -- Listeners -- */
[].forEach.call(tableHeaders, (header, index) => {
  header.addEventListener('click', () => {
    sortColumn(index);
    tableHeaders.forEach((hdr, idx) => {
      if (idx !== index) {
        directions[idx] = '';
        hdr.dataset.direction = '';
      }
    });
    header.dataset.direction = directions[index];
  });
});

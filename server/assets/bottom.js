/* This file is at the bottom of the html body tag */
/* It requires the body to be in the DOM before it runs */

/** -- Variables -- */
const table = document.querySelector('table');
const tableHeaders = table.querySelectorAll('th:not([data-type="exclude"])');
const tableBody = table.querySelector('tbody');

/** -- Sorting -- */
const directions = Array.from(tableHeaders).map(() => {
  return '';
});

/** -- Initial paint -- */
document.getElementById('flags').innerHTML = allFlags.join('');
directions[2] = 'desc';

const tableRows = tableBody.querySelectorAll('tr');

/** -- Sort -- */
const transformData = (index, data) => {
  const type = tableHeaders[index].dataset.type;

  switch (type) {
    case 'number':
      return Number(data);
    case 'boolean':
      return data.includes('notEnabled');
    case 'date':
      return dayjs(data);
    default:
      return data.toUpperCase();
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

    if (typeof a === 'object') {
      return (a.isBefore(b) ? -1 : 1) * multiplier;
    }

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
  tableHeaders[index].dataset.direction = direction;

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
  });
});

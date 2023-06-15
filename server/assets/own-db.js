const ownDb = (() => {
  const dayjs = window.dayjs;

  /** ----- VARIABLES ----- */
  const removeRegex = /[^A-Za-z0-9-]/gi;
  const content = document.getElementById('content');

  // flag items
  const flags = [];
  let flagEditing;

  const queries = {
    toggle: (id) => `mutation ToggleFlag {
      toggleFlag(id: ${id}) {
        id
        name
        description
        enabled
        updatedAt
      }
    }`,
    create: (data) => `mutation CreateFlag {
      createFlag(${data}) {
        id
        name
        description
        enabled
        updatedAt
      }
    }`,
    update: (id, data) => `mutation updateFlag {
      updateFlag(id: ${id}, ${data}) {
        id
        name
        description
        enabled
        updatedAt
      }
    }`,
    delete: (id) => `mutation DeleteFlag {
      deleteFlag(id: ${id}) {
        id
        name
        description
        enabled
        updatedAt
      }
    }`,
  };

  // table items
  let table;
  let tableHeaders;
  let tableBody;
  let noFlagsElement;

  const directions = {};

  // form items
  const formType = { create: 'create', update: 'update' };
  let formWrapper;

  // search items
  let searchWrapper;
  let searchInput;
  let searchButton;

  /** ----- FUNCTIONS ----- */
  const changeToParamCase = (str) => {
    return str
      .split(' ')
      .map((word) => word.toLowerCase().replace(removeRegex, ''))
      .join('-');
  };

  const formatDate = (date) => {
    return dayjs(date).format('MMM DD, YY h:mm a');
  };

  // flag items
  const getApiConfig = (query) => {
    return {
      url: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    };
  };

  const callToggleFlag = (id) => {
    const { flagIndex } = getTableRowAndFlagData(id);
    const { url, body, headers, method } = getApiConfig(queries.toggle(id));

    fetch(url, { method, headers, body })
      .then((res) => res.json())
      .then((result) => {
        const { toggleFlag } = result.data;
        flags[flagIndex] = toggleFlag;
        updateTableRow(toggleFlag);
      })
      .catch((err) => console.log(err));
  };

  const callDeleteFlag = (id) => {
    const { body, headers, method, url } = getApiConfig(queries.delete(id));

    fetch(url, { method, headers, body })
      .then(() => deleteTableRow(id))
      .catch((err) => console.log(err));
  };

  // table items
  const createNoFlagsFoundRow = () => {
    tableBody.innerHTML = `
        <tr class='empty'>
          <td colspan='5' class='text-center'>No flags found</td>
        </tr>
      `;

    noFlagsElement = tableBody.querySelector('tr.empty');
    searchInput.setAttribute('disabled', true);
    searchButton.setAttribute('disabled', true);
  };

  const removeNoFlagsFoundRow = () => {
    if (noFlagsElement) {
      noFlagsElement.remove();
      noFlagsElement = null;
      searchInput.removeAttribute('disabled');
      searchButton.removeAttribute('disabled');
    }
  };

  const createTableElement = (flagsArr) => {
    table = content.querySelector('table');
    const newBody = document.createElement('tbody');

    table.classList.add('table', 'table-bordered');
    table.innerHTML = `
      <thead>
        <tr>
          <th data-id='name' data-type='text'><div>Name</div></th>
          <th data-id='description' data-type='text'><div>Description</div></th>
          <th data-id='enabled' data-type='boolean' class='column-150'><div>Enabled</div></th>
          <th data-id='updatedAt' data-type='date' class='column-200'><div class='row-reverse'>Updated At</div></th>
          <th data-type='exclude' class='column-100'><div class='text-center'>Actions</div></th>
        </tr>
      </thead>
    `;
    table.append(newBody);

    tableHeaders = table.querySelectorAll('th:not([data-type="exclude"])');
    tableBody = table.querySelector('tbody');
    flagsArr.forEach((flag) => createNewTableRow(flag));
  };

  const getTableRowAndFlagData = (id) => {
    const row = table.querySelector(`[data-row="${id}"]`);
    const rowIndex = row.rowIndex;
    const flagIndex = flags.findIndex((flag) => flag.id === id);
    const flag = flags[flagIndex];
    return { flag, flagIndex, row, rowIndex };
  };

  const whichEnableMark = (flag) => {
    if (flag.enabled) {
      return 'fa-check';
    }
    return 'fa-xmark';
  };

  const whichFlagToggle = (flag) => {
    if (flag.enabled) {
      return 'fa-toggle-off';
    }
    return 'fa-toggle-on';
  };

  const createTableRowHtml = (flag) => {
    return `
    <tr data-row='${flag.id}'>
      <td>${flag.name}</td>
      <td>${flag.description}</td>
      <td class='text-center'>
        <i class='fa-solid ${whichEnableMark(flag)} fa-lg'></i>
      </td>
      <td class='text-right'>${formatDate(flag.updatedAt)}</td>
      <td>
        <div style='display: flex; column-gap: 16px;'>
          <button class='icon delete' onclick='ownDb.callDeleteFlag(${
            flag.id
          })'>
            <i class='fa-solid fa-xmark fa-xl'></i>
          </button>
          <button
            class='icon edit'
            onclick='ownDb.handleFormToggle(ownDb.formType.update, ${flag.id})'
          >
            <i class='fa-solid fa-pen'></i>
          </button>
          <button class='icon toggle' onclick='ownDb.callToggleFlag(${
            flag.id
          })'>
            <i class='fa-solid ${whichFlagToggle(flag)} fa-lg'></i>
          </button>
        </div>
      </td>
    </tr>
  `;
  };

  const removeSorting = () => {
    Object.keys(directions).forEach((key) => {
      directions[key] = '';
      table.querySelector(`[data-id="${key}"]`).dataset.direction = '';
    });
  };

  const createNewTableRow = (flag, isInitial = false) => {
    removeNoFlagsFoundRow();
    const row = tableBody.insertRow();
    flags.push(flag);
    row.setAttribute('data-row', flag.id);
    row.innerHTML = createTableRowHtml(flag);
    isInitial && removeSorting();
  };

  const updateTableRow = (flag) => {
    const { flagIndex, row } = getTableRowAndFlagData(flag.id);
    flags[flagIndex] = flag;
    row.setAttribute('data-row', flag.id);
    row.innerHTML = createTableRowHtml(flag);
    removeSorting();
  };

  const deleteTableRow = (id) => {
    const { flagIndex, row } = getTableRowAndFlagData(id);
    flags.splice(flagIndex, 1);
    row.remove();
    if (flags.length === 0) {
      createNoFlagsFoundRow();
    }
  };

  const transformData = (index, data) => {
    const type = tableHeaders[index].dataset.type;

    switch (type) {
      case 'number':
        return Number(data);
      case 'boolean':
        return data.includes('fa-xmark');
      case 'date':
        return dayjs(data);
      default:
        return data.toUpperCase();
    }
  };

  const sortColumn = (index, colId) => {
    const direction = directions[colId] || 'asc';
    const multiplier = direction === 'asc' ? 1 : -1;

    const currentTableRows = tableBody.querySelectorAll('tr');
    const clonedRows = Array.from(currentTableRows);

    clonedRows.sort((rowA, rowB) => {
      const cellA = rowA.querySelectorAll('td')[index].innerHTML;
      const cellB = rowB.querySelectorAll('td')[index].innerHTML;

      const a = transformData(index, cellA);
      const b = transformData(index, cellB);

      if (typeof a === 'object') {
        // .isBefore is from dayjs
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
    [].forEach.call(currentTableRows, (row) => {
      tableBody.removeChild(row);
    });

    // update all header directions
    const setDirection = direction === 'asc' ? 'desc' : 'asc';
    directions[colId] = setDirection;
    tableHeaders[index].dataset.direction = setDirection;

    // add new rows
    clonedRows.forEach((row) => {
      tableBody.appendChild(row);
    });
  };

  // search table items
  const createSearchElement = () => {
    searchWrapper.innerHTML = `
      <form>
        <fieldset class='stack stack-row'>
          <input type='search' id='search-own' placeholder='Search'>
  
          <button type='button' onclick='ownDb.handleSearchCancel()'>
            Cancel
          </button>
        </fieldset>
      </form>
    `;

    searchInput = searchWrapper.querySelector('input#search-own');
    searchButton = searchWrapper.querySelector('button');
    searchInput.addEventListener('keyup', handleSearchInput);
  };

  const handleSearchInput = (event) => {
    const value = event.target.value.toUpperCase();
    const rows = tableBody.querySelectorAll('tr');

    // hide rows that don't match
    [].forEach.call(rows, (row) => {
      const cells = row.querySelectorAll('td');
      let found = false;
      [].forEach.call(cells, (cell) => {
        if (cell.innerHTML.toUpperCase().indexOf(value) > -1) {
          found = true;
        }
      });
      if (found) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  };

  const handleSearchCancel = () => {
    searchInput.value = '';
    handleSearchInput({ target: { value: '' } });
  };

  // form items
  const updateNameCase = () => {
    const input = formWrapper.querySelector('input#name');
    input.value = changeToParamCase(input.value);
  };

  const createFormElement = (type, values) => {
    return `
      <form class='stack'>
        <div class='form-grid'>
          <fieldset>
            <label for='name'>Name</label>
            <input
              type='text'
              id='name'
              name='name'
              maxlength='25'
              value='${values.name}'
              onkeyup='ownDb.updateNameCase()'
            />
            <div>(max 25 of letters, numbers, and dashes "-")</div>
          </fieldset>

          <fieldset>
            <label for='description'>Description</label>
            <input type='text' id='description' name='description' value='${values.description}' />
          </fieldset>
        </div>

        <div class='stack stack-row stack-gap-large'>
          <button class='btn btn-warning' type='button' onclick='ownDb.handleFormCancel()'>
            Cancel
          </button>
          <button class='btn btn-primary' type='button' onclick='ownDb.handleFormSubmit("${type}")'>
            Submit
          </button>
        </div>
      </form>
    `;
  };

  const handleFormToggle = (type, id) => {
    const values = {
      name: '',
      description: '',
    };

    if (id && type === formType.update) {
      const flag = flags.find((flag) => flag.id === id);
      values.name = flag.name;
      values.description = flag.description;
      flagEditing = id;
    }

    formWrapper.innerHTML = `
      <hr/>
      <h2>${type} flag</h2>
      ${
        type === formType.create
          ? '<p>New flags will be enabled by default</p>'
          : ''
      }
      ${createFormElement(type, values)}
      <hr/>
    `;
  };

  const handleFormCancel = () => {
    formWrapper.innerHTML = '';
  };

  const handleFormSubmit = (type) => {
    const form = formWrapper.querySelector('form');
    const name = form.querySelector('#name').value;
    const description = form.querySelector('#description').value;
    const queryData = `name: "${name}", description: "${description}"`;
    const { body, headers, method, url } =
      type === formType.create
        ? getApiConfig(queries.create(queryData))
        : getApiConfig(queries.update(flagEditing, queryData));

    fetch(url, { body, headers, method })
      .then((res) => res.json())
      .then((result) => {
        const flag =
          result.data[type === formType.create ? 'createFlag' : 'updateFlag'];
        if (type === formType.create) {
          createNewTableRow(flag);
        } else {
          updateTableRow(flag);
        }
        handleFormCancel();
      })
      .catch((err) => console.log(err));
  };

  // general
  const createContent = (flagsArr) => {
    content.innerHTML = `
      <div class="stack stack-gap-large">
        <h2>Option where each environment has its own database</h2>
      
        <div class='stack stack-no-gap'>
          <div class='title'>
            <div class='search-form'></div>
            <button
              type="button"
              class="btn btn-primary"
              onclick='ownDb.handleFormToggle(ownDb.formType.create)'
            >
              <i class='fa-solid fa-plus'></i>
              Create New
            </button>
          </div>
          
          <table></table>
        </div>
        
        <div class='form-wrapper stack'></div>
      </div>
    `;

    formWrapper = content.querySelector('.form-wrapper');
    searchWrapper = content.querySelector('.search-form');
    createTableElement(flagsArr);
    createSearchElement();

    if (!flagsArr.length) {
      createNoFlagsFoundRow();
    }
  };

  /** ----- SETUP ----- */
  const setup = () => {
    const newFlags = JSON.parse(window.flagsOwn.replaceAll('&#34;', '"'));

    createContent(newFlags);

    [].forEach.call(tableHeaders, (header, index) => {
      const columnId = header.dataset.id;
      header.addEventListener('click', () => {
        sortColumn(index, columnId);

        tableHeaders.forEach((hdr) => {
          const colId = hdr.dataset.id;
          if (colId !== columnId) {
            directions[colId] = '';
            hdr.dataset.direction = '';
          }
        });
      });
    });

    table.querySelector('[data-id="enabled"]').click();
  };

  return {
    callDeleteFlag,
    callToggleFlag,
    formType,
    handleFormCancel,
    handleFormSubmit,
    handleFormToggle,
    handleSearchCancel,
    handleSearchInput,
    setup,
    updateNameCase,
  };
})();

ownDb.setup();

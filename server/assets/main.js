/**
 * Server side rendering of the main page
 *
 * Table of Contents
 * - VARIABLES
 * - FUNCTIONS
 * - HTML STUFF
 * - SORTING
 * - SEARCH
 * - API CALLS
 * - ADD EDIT FORM
 * - SETUP & RESET
 */

const dbType = (() => {
  /** ----- VARIABLES ----- */
  const removeRegex = /[^A-Za-z0-9-]/gi;
  let content;

  const dbTypeOptions = ['own', 'single'];
  const graphQlOptions = {
    own: {
      queries: {
        get: 'getAllFlags',
      },
      mutations: {
        create: 'createFlag',
        update: 'updateFlag',
        toggle: 'toggleFlag',
        delete: 'deleteFlag',
      },
      returns: ['id', 'name', 'description', 'enabled', 'updatedAt'],
    },
    single: {
      queries: {
        get: 'getAllFlagsSDB',
      },
      mutations: {
        create: 'createFlagSDB',
        update: 'updateFlagSDB',
        toggle: 'toggleFlagSDB',
        delete: 'deleteFlagSDB',
      },
      returns: [
        'id',
        'name',
        'description',
        'localEnabled',
        'stagingEnabled',
        'productionEnabled',
        'updatedAt',
      ],
    },
  };

  const tableOptions = {
    own: {
      headers: [
        { id: 'name', label: 'Name', sortable: true, type: 'text' },
        {
          id: 'description',
          label: 'Description',
          sortable: true,
          type: 'text',
        },
        {
          id: 'enabled',
          label: 'Enabled',
          class: ['column-150'],
          sortable: true,
          type: 'boolean',
        },
        {
          id: 'updatedAt',
          label: 'Updated At',
          class: ['column-200'],
          divClassList: ['row-reverse'],
          sortable: true,
          type: 'date',
        },
        {
          id: 'actions',
          label: 'Actions',
          class: ['column-100'],
          divClassList: ['text-center'],
          sortable: false,
          type: 'actions',
        },
      ],
      row: [
        { id: 'name' },
        { id: 'description' },
        { id: 'enabled', divClassList: ['text-center'], isToggleColumn: true },
        { id: 'updatedAt', class: ['text-right'] },
        { id: 'actions', includeToggle: true, toggle: 'enabled' },
      ],
    },
    single: {
      headers: [
        { id: 'name', label: 'Name', sortable: true, type: 'text' },
        {
          id: 'description',
          label: 'Description',
          sortable: true,
          type: 'text',
        },
        {
          id: 'localEnabled',
          label: 'Local',
          class: ['column-140'],
          sortable: true,
          type: 'boolean',
        },
        {
          id: 'stagingEnabled',
          label: 'Staging',
          class: ['column-140'],
          sortable: true,
          type: 'boolean',
        },
        {
          id: 'productionEnabled',
          label: 'Production',
          class: ['column-140'],
          sortable: true,
          type: 'boolean',
        },
        {
          id: 'updatedAt',
          label: 'Updated At',
          class: ['column-180'],
          divClassList: ['row-reverse'],
          sortable: true,
          type: 'date',
        },
        {
          id: 'actions',
          label: 'Actions',
          class: ['column-100'],
          divClassList: ['text-center'],
          sortable: false,
          type: 'actions',
        },
      ],
      row: [
        { id: 'name' },
        { id: 'description' },
        {
          id: 'localEnabled',
          divClassList: [
            'stack',
            'stack-row',
            'stack-justified-around',
            'stack-align-center',
          ],
          includeToggle: true,
          toggle: 'localEnabled',
          isToggleColumn: true,
        },
        {
          id: 'stagingEnabled',
          divClassList: [
            'stack',
            'stack-row',
            'stack-justified-around',
            'stack-align-center',
          ],
          includeToggle: true,
          toggle: 'stagingEnabled',
          isToggleColumn: true,
        },
        {
          id: 'productionEnabled',
          divClassList: [
            'stack',
            'stack-row',
            'stack-justified-around',
            'stack-align-center',
          ],
          includeToggle: true,
          toggle: 'productionEnabled',
          isToggleColumn: true,
        },
        { id: 'updatedAt' },
        { id: 'actions' },
      ],
    },
  };

  let dbOption;

  const flags = [];
  let editingFlagId;

  let table;
  let tableHeaders;
  let tableBody;
  let noFlagsElement;

  const directions = {};

  const formType = { create: 'create', update: 'update' };
  let formWrapper;

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

  const buildQuery = (name) => {
    const opt = graphQlOptions[dbOption];
    return getApiConfig(`query ${opt.queries[name]} {
      ${opt.queries[name]} {
        ${opt.returns.join('\n')}
      }
    }`);
  };

  const buildMutation = (name, variables) => {
    const opt = graphQlOptions[dbOption];
    return getApiConfig(`mutation ${opt.mutations[name]} {
      ${opt.mutations[name]}(${variables}) {
        ${opt.returns.join('\n')}
      }
    }`);
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

  const whichFlagToggle = (flag, key) => {
    if (flag[key]) {
      return { mark: 'fa-check', toggle: 'fa-toggle-off' };
    }

    return { mark: 'fa-xmark', toggle: 'fa-toggle-on' };
  };

  const updateNameCase = () => {
    const input = formWrapper.querySelector('input#name');
    input.value = changeToParamCase(input.value);
  };

  const getTableRowAndFlagData = (id) => {
    const row = table.querySelector(`[data-row="${id}"]`);
    const rowIndex = row.rowIndex;
    const flagIndex = flags.findIndex((flag) => flag.id === id);
    const flag = flags[flagIndex];
    return { flag, flagIndex, row, rowIndex };
  };

  /* ------ HTML STUFF ------ */
  const createMainContent = () => {
    content.innerHTML = `
      <div class="stack stack-gap-large">
        <h2>Option where each environment shares a single database</h2>
      
        <div class='stack stack-no-gap'>
          <div class='title'>
            <div class='search-form'></div>
            <button
              type="button"
              class="btn btn-primary"
              onclick='dbType.handleFormOpen(dbType.formType.create)'
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
    createTableElement();
    createSearchElement();

    flags.length > 0 &&
      table
        .querySelector(
          `th[data-id="${dbOption === 'own' ? 'enabled' : 'localEnabled'}"]`
        )
        .click();
  };

  const createTableElement = () => {
    table = content.querySelector('table');
    table.classList.add('table', 'table-bordered');
    createTableHeaderElement();
    createTableBodyElement();
  };

  const createTableHeaderElement = () => {
    const thead = document.createElement('thead');
    table.append(thead);

    const headers = [];
    tableOptions[dbOption].headers.forEach((header, index) => {
      const th = document.createElement('th');
      if (header.class) {
        th.classList.add(...header.class);
      }
      th.setAttribute('data-id', header.id);
      th.innerHTML = `<div>${header.label}</div>`;

      if (header.divClassList) {
        th.querySelector('div').classList.add(...header.divClassList);
      }

      if (header.sortable) {
        th.setAttribute('data-type', header.type);
        th.classList.add('sortable');
        th.addEventListener('click', () => {
          sortColumn(index, header.id);
        });
      }
      headers.push(th);
    });
    tableHeaders = headers;
    thead.append(...headers);
  };

  const createTableBodyElement = () => {
    const newBody = document.createElement('tbody');
    tableBody = newBody;
    table.append(newBody);

    if (flags.length) {
      flags.forEach((flag) => {
        createTableRowElement(flag);
      });
    } else {
      createNoFlagsFoundRowElement();
    }
  };

  const createTableRowElement = (flag, atIndex = -1, add = false) => {
    removeNoFlagsFoundRow();

    if (add) {
      flags.push(flag);
      removeSorting();
    }

    const row = tableBody.insertRow(atIndex);
    row.setAttribute('data-row', flag.id);
    const rowOpts = tableOptions[dbOption].row;

    Object.entries(flag).forEach(([key, value]) => {
      const rowOptData = rowOpts.find((opt) => opt.id === key);
      if (rowOptData) {
        const cell = row.insertCell();

        if (rowOptData.isToggleColumn) {
          const div = document.createElement('div');
          div.classList.add(...rowOptData.divClassList);

          const { mark } = whichFlagToggle(flag, key);
          const icon = document.createElement('i');
          icon.classList.add('fa-solid', mark, 'fa-lg');
          div.append(icon);

          if (rowOptData.includeToggle) {
            const toggle = createToggleElement(flag, rowOptData.toggle);
            div.append(toggle);
          }
          cell.append(div);
        } else if (key === 'updatedAt') {
          cell.innerText = formatDate(value);
        } else {
          cell.innerText = `${value}`;
        }
      }
    });

    // ACTIONS CELL
    const actionOptData = rowOpts.find((opt) => opt.id === 'actions');
    const actionCell = row.insertCell();
    actionCell.innerHTML = `
      <div style='display: flex; column-gap: 16px;'>
        <button class='icon delete' onclick='dbType.callDeleteFlag(${flag.id})'>
          <i class='fa-solid fa-xmark fa-xl'></i>
        </button>
        <button
          class='icon edit'
          onclick='dbType.handleFormOpen(dbType.formType.update, ${flag.id})'
        >
          <i class='fa-solid fa-pen'></i>
        </button>
      </div>`;
    if (actionOptData.includeToggle) {
      const button = createToggleElement(flag, actionOptData.toggle);
      actionCell.querySelector('div').append(button);
    }
  };

  const createToggleElement = (flag, key) => {
    const button = document.createElement('button');
    button.classList.add('icon', 'toggle');
    const { toggle } = whichFlagToggle(flag, key);
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', toggle, 'fa-lg');
    button.append(icon);
    button.addEventListener('click', () => {
      callToggleFlag(flag.id, key, !flag[key]);
    });

    return button;
  };

  const createSearchElement = () => {
    searchWrapper.innerHTML = `
      <form>
        <fieldset class='stack stack-row'>
          <input type='search' id='search-single' placeholder='Search'>
  
          <button type='button' onclick='dbType.handleSearchCancel()'>
            Cancel
          </button>
        </fieldset>
      </form>
    `;

    searchInput = searchWrapper.querySelector('input#search-single');
    searchButton = searchWrapper.querySelector('button');
    searchInput.addEventListener('keyup', handleSearchInput);
  };

  const createNoFlagsFoundRowElement = () => {
    tableBody.innerHTML = `
        <tr class='empty'>
          <td colspan='7' class='text-center'>No flags found</td>
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

  const updateTableRowElement = (flag) => {
    const { flagIndex, row, rowIndex } = getTableRowAndFlagData(flag.id);
    flags[flagIndex] = flag;
    row.remove();
    createTableRowElement(flag, rowIndex, false);
    removeSorting();
  };

  const createFormWrapperElement = (type, values) => {
    formWrapper.innerHTML = `
      <hr/>
      <h2>${type} flag</h2>
      ${
        type === formType.create
          ? '<p>New flags will be enabled in all environments by default</p>'
          : ''
      }
      ${createAddEditFormElement(type, values)}
      <hr/>
    `;
  };

  const createAddEditFormElement = (type, values) => {
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
              onkeyup='dbType.updateNameCase()'
            />
            <div>(max 25 of letters, numbers, and dashes "-")</div>
          </fieldset>

          <fieldset>
            <label for='description'>Description</label>
            <input type='text' id='description' name='description' value='${values.description}' />
          </fieldset>
        </div>

        <div class='stack stack-row stack-gap-large'>
          <button class='btn btn-warning' type='button' onclick='dbType.removeAddEditFormElement()'>
            Cancel
          </button>
          <button class='btn btn-primary' type='button' onclick='dbType.handleFormSubmit("${type}")'>
            Submit
          </button>
        </div>
      </form>
    `;
  };

  const removeAddEditFormElement = () => {
    if (formWrapper) {
      formWrapper.innerHTML = '';
    }
  };

  /* ------ SORTING ------ */
  const removeSorting = (id = undefined) => {
    Object.keys(directions).forEach((key) => {
      if (id && id === key) {
        // do nothing
      } else {
        directions[key] = '';
        delete directions[key];
        table.querySelector(`[data-id="${key}"]`).dataset.direction = '';
      }
    });
  };

  const sortColumn = (index, columnId) => {
    // include clearing out all other columns here
    removeSorting(columnId);

    // get current rows
    const currentTableRows = tableBody.querySelectorAll('tr');
    const clonedRows = Array.from(currentTableRows);

    const direction = directions[columnId] || 'asc';
    const multiplier = direction === 'asc' ? 1 : -1;

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

    // update header direction
    const setDirection = direction === 'asc' ? 'desc' : 'asc';
    directions[columnId] = setDirection;
    tableHeaders[index].dataset.direction = setDirection;

    // add sorted rows
    clonedRows.forEach((row) => {
      tableBody.appendChild(row);
    });
  };

  /* ------ SEARCH ------ */
  const handleSearchInput = (e) => {
    const value = e.target.value.toUpperCase();
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

  /* ------ API CALLS ------ */
  const callDeleteFlag = (id) => {
    const { body, headers, method, url } = buildMutation('delete', `id: ${id}`);

    fetch(url, {
      method,
      headers,
      body,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.errors) {
          console.log('RESULT ERROR', result.errors);
        } else {
          const { flagIndex, row } = getTableRowAndFlagData(id);
          flags.splice(flagIndex, 1);
          row.remove();
          if (flags.length === 0) {
            createNoFlagsFoundRowElement();
          }
        }
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  };

  const callUpdateFlag = (id, values) => {
    const queryValues = `id: ${id}, ${values}`;
    const { body, headers, method, url } = buildMutation('update', queryValues);

    fetch(url, {
      method,
      headers,
      body,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.errors) {
          console.log('RESULT ERROR', result.errors);
        } else {
          removeAddEditFormElement();
          const flag = result.data[graphQlOptions[dbOption].mutations.update];
          updateTableRowElement(flag);
        }
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  };

  const callCreateFlag = (values) => {
    const { body, headers, method, url } = buildMutation('create', values);

    fetch(url, {
      method,
      headers,
      body,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.errors) {
          console.log('RESULT ERROR', result.errors);
        } else {
          const flag = result.data[graphQlOptions[dbOption].mutations.create];
          flags.push(flag);
          removeAddEditFormElement();
          createTableRowElement(flag, 0, false);
        }
      })
      .catch((err) => console.log('ERROR', err));
  };

  const callToggleFlag = (id, key, bool) => {
    const { body, headers, method, url } = buildMutation(
      'toggle',
      `id: ${id}, data: {${key}: ${bool}}`
    );

    fetch(url, {
      method,
      headers,
      body,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.errors) {
          console.log('RESULT ERROR', result.errors);
        } else {
          updateTableRowElement(
            result.data[graphQlOptions[dbOption].mutations.toggle]
          );
        }
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  };

  /* ------ ADD EDIT FORM ------ */
  const handleFormOpen = (type, id) => {
    const values = {
      name: '',
      description: '',
    };

    if (id && type === formType.update) {
      const flag = flags.find((flag) => flag.id === id);
      values.name = flag.name;
      values.description = flag.description;
      values.id = id;
      editingFlagId = id;
    }

    createFormWrapperElement(type, values);
  };

  const handleFormSubmit = (type) => {
    const form = formWrapper.querySelector('form');
    const name = form.querySelector('#name').value;
    const description = form.querySelector('#description').value;
    const queryData = `name: "${name}", description: "${description}"`;

    if (type === formType.create) {
      callCreateFlag(queryData);
    } else {
      callUpdateFlag(editingFlagId, queryData);
    }
  };

  /* ------ SETUP & RESET ------ */
  const setup = (type) => {
    if (dbTypeOptions.includes(type)) {
      if (table) {
        reset();
      }
      dbOption = type;
      content = document.getElementById('content');
      const { body, headers, method, url } = buildQuery('get');
      fetch(url, { method, headers, body })
        .then((res) => res.json())
        .then((result) => {
          const data = result.data[graphQlOptions[dbOption].queries.get];
          flags.push(...data);
          createMainContent(data);
        })
        .catch(console.error);
    } else {
      throw new Error('Invalid db type');
    }
  };

  const reset = () => {
    removeSorting();
    formWrapper = null;
    searchInput = null;
    searchButton = null;
    searchWrapper = null;
    editingFlagId = null;
    noFlagsElement = null;
    tableHeaders = null;
    tableBody = null;
    table = null;
    content.innerHTML = '';
    dbOption = null;
    flags.length = 0;
  };

  return {
    callDeleteFlag,
    callToggleFlag,
    formType,
    handleFormSubmit,
    handleFormOpen,
    handleSearchCancel,
    removeAddEditFormElement,
    setup,
    updateNameCase,
  };
})();

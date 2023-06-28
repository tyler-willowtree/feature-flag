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
  shared: {
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
      {
        id: 'name',
        label: 'Name',
        sortable: true,
        type: 'text',
        defaultSort: 'asc',
      },
      {
        id: 'description',
        label: 'Description',
        sortable: true,
        type: 'text',
      },
      {
        id: 'enabled',
        label: 'Enabled',
        classList: ['column-150'],
        sortable: true,
        type: 'boolean',
        // defaultSort: 'asc',
      },
      {
        id: 'updatedAt',
        label: 'Updated At',
        classList: ['column-200'],
        divClassList: ['row-reverse'],
        sortable: true,
        type: 'date',
      },
      {
        id: 'actions',
        label: 'Actions',
        classList: ['column-100'],
        divClassList: ['text-center'],
        sortable: false,
        type: 'actions',
      },
    ],
    rows: [
      { id: 'name' },
      { id: 'description' },
      {
        id: 'enabled',
        divClassList: [
          'stack',
          'stack-row',
          'stack-justified-around',
          'stack-align-center',
        ],
        isToggleColumn: true,
      },
      { id: 'updatedAt', divClassList: ['text-right'], type: 'date' },
      { id: 'actions', includeToggle: true, toggle: 'enabled' },
    ],
  },
  shared: {
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
        classList: ['column-140'],
        sortable: true,
        type: 'boolean',
        defaultSort: 'desc',
      },
      {
        id: 'stagingEnabled',
        label: 'Staging',
        classList: ['column-140'],
        sortable: true,
        type: 'boolean',
      },
      {
        id: 'productionEnabled',
        label: 'Production',
        classList: ['column-140'],
        sortable: true,
        type: 'boolean',
      },
      {
        id: 'updatedAt',
        label: 'Updated At',
        classList: ['column-180'],
        divClassList: ['row-reverse'],
        sortable: true,
        type: 'date',
      },
      {
        id: 'actions',
        label: 'Actions',
        classList: ['column-100'],
        divClassList: ['text-center'],
        sortable: false,
        type: 'actions',
      },
    ],
    rows: [
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
      { id: 'updatedAt', divClassList: ['text-right'], type: 'date' },
      { id: 'actions' },
    ],
  },
};

const dbOptions = ['own', 'shared'];
const formTypes = { create: 'create', update: 'update' };

/* NOTE: dayjs must be included in the head prior to this file */
class PageSetup {
  #db = null;
  #allFlags = [];
  #pagedFlags = [[]];
  #sortBy = {};

  #searchString = '';
  #perPage = 5;
  #currentPage = 1;
  #currentPageForArray = 0;
  #editing;

  #content;
  #tableHead;
  #tableBody;
  #pagination;
  #prevButton;
  #nextButton;
  #addEditForm;

  constructor(type) {
    if (dbOptions.includes(type)) {
      this.#db = type;
      this.#content = document.getElementById('content');
      this.initialize();
    } else {
      throw new Error(`Invalid database type: "${type}"`);
    }
  }

  /* ------ General Methods ------ */
  #buildMutation(name, variables) {
    const { mutations, returns } = graphQlOptions[this.#db];
    return this.#getApiConfig(`mutation ${mutations[name]} {
      ${mutations[name]}(${variables}) {
        ${returns.join('\n')}
      }
    }`);
  }

  #buildQuery(name) {
    const { queries, returns } = graphQlOptions[this.#db];
    return this.#getApiConfig(`query ${queries[name]} {
      ${queries[name]} {
        ${returns.join('\n')}
      }
    }`);
  }

  #createPagedFlags() {
    let array = [...this.#allFlags]; // pre sorted
    if (this.#searchString.length) {
      array = array.filter((flag) => {
        return Object.values(flag).some((value) => {
          return String(value)
            .toLowerCase()
            .includes(this.#searchString.toLowerCase());
        });
      });
    }
    this.#pagedFlags = array.reduce((acc, curr, index) => {
      if (index % this.#perPage === 0) {
        acc.push([curr]);
      } else {
        acc[acc.length - 1].push(curr);
      }
      return acc;
    }, []);
  }

  #formatDate(date) {
    return dayjs(date).format('MMM DD, YY h:mm a');
  }

  #getApiConfig(query) {
    return {
      url: '/graphql',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    };
  }

  #htmlCreateButton({ type, className, icon, label, clickHandler }) {
    const button = document.createElement('button');
    button.type = type;
    button.classList.add('btn', `btn-${className}`);
    button.textContent = label;
    button.addEventListener('click', clickHandler);
    if (icon) {
      const iconEl = document.createElement('i');
      iconEl.classList.add('fas', `fa-${icon}`);
      button.prepend(iconEl);
    }
    return button;
  }

  #transformData(data) {
    const row = tableOptions[this.#db].headers;
    const colType = row.find((cell) => this.#sortBy.id === cell.id).type;
    if (colType === 'date') {
      return this.#formatDate(data);
    } else if (colType === 'boolean') {
      return Boolean(data);
    } else if (colType === 'number') {
      return Number(data);
    }
    return data;
  }

  /* ------ Sort Methods ------ */
  #toggleDirection(direction) {
    return direction === 'asc' ? 'desc' : 'asc';
  }

  #setPage(page) {
    this.#currentPage = page;
    this.#currentPageForArray = page - 1;
  }

  #sortColumn() {
    const { id, direction } = this.#sortBy;
    const multiplier = direction === 'asc' ? 1 : -1;

    const sortFn = (a, b) => {
      const aData = this.#transformData(a[id]);
      const bData = this.#transformData(b[id]);

      if (a.type === 'date') {
        return (aData.isBefore(bData) ? -1 : 1) * multiplier;
      }

      if (aData < bData) return -1 * multiplier;
      if (aData > bData) return 1 * multiplier;
      return 0;
    };

    this.#allFlags.sort(sortFn);
  }

  /* ------ API Calls ------ */
  addFlag(data) {
    const { body, headers, method, url } = this.#buildMutation('create', data);

    fetch(url, { method, headers, body })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          throw new Error(res.errors[0].message);
        }
        const data = res.data[graphQlOptions[this.#db].mutations.create];
        if (data) {
          this.#allFlags.unshift(data);
          this.#setPage(1);
          this.#createPagedFlags();
          this.handleAddEditFormCancel();
          this.#updateCustomTableBody();
          this.#updateCustomTablePagination();
        }
      })
      .catch((err) => console.log(err));
  }

  deleteFlag(id) {
    const { body, headers, method, url } = this.#buildMutation(
      'delete',
      `id: ${id}`
    );
    fetch(url, { method, headers, body })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          throw new Error(res.errors[0].message);
        }
        const data = res.data[graphQlOptions[this.#db].mutations.delete];
        if (data) {
          this.#allFlags = this.#allFlags.filter((flag) => flag.id !== id);
          this.#createPagedFlags();
          this.#updateCustomTableBody();
          this.#updateCustomTablePagination();
        }
      })
      .catch((err) => console.log(err));
  }

  editFlag(data) {
    const { body, headers, method, url } = this.#buildMutation('update', data);
    fetch(url, { method, headers, body })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          throw new Error(res.errors[0].message);
        }
        const data = res.data[graphQlOptions[this.#db].mutations.update];
        if (data) {
          const index = this.#allFlags.findIndex((flag) => flag.id === data.id);
          this.#allFlags[index] = data;
          this.#createPagedFlags();
          this.handleAddEditFormCancel();
          this.#updateCustomTableBody();
          this.#updateCustomTablePagination();
        }
      })
      .catch((err) => console.log(err));
  }

  toggleFlag(id, key, bool) {
    const { body, headers, method, url } = this.#buildMutation(
      'toggle',
      `id: ${id}, data: {${key}: ${bool}}`
    );
    fetch(url, { method, headers, body })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          throw new Error(res.errors[0].message);
        }
        const data = res.data[graphQlOptions[this.#db].mutations.toggle];
        if (data) {
          const index = this.#allFlags.findIndex((flag) => flag.id === id);
          this.#allFlags[index] = data;
          this.#createPagedFlags();
          this.#updateCustomTableBody();
        }
      })
      .catch((err) => console.log(err));
  }

  /* ------ Update Components ------ */
  #checkPaginationButtons() {
    if (this.#currentPage === 1) {
      this.#prevButton.setAttribute('disabled', true);
    } else {
      this.#prevButton.removeAttribute('disabled');
    }

    if (this.#currentPage === this.#pagedFlags.length) {
      this.#nextButton.setAttribute('disabled', true);
    } else {
      this.#nextButton.removeAttribute('disabled');
    }
  }

  #updateAddEditForm(show) {
    if (show) {
      this.#addEditForm.setAttribute('show', true);
      const fields = [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          value: this.#editing ? this.#editing.name : '',
          maxLength: 25,
          actions: [
            {
              name: 'keyup',
              functionName: 'updateCasing',
              overwritesValue: true,
            },
          ],
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          value: this.#editing ? this.#editing.description : '',
        },
      ];

      if (this.#editing) {
        this.#addEditForm.setAttribute('add-edit', 'edit');
        this.#addEditForm.setAttribute('title', 'Edit Flag');
        this.#addEditForm.setAttribute(
          'subtitle',
          'Use the toggle to change the flag status.'
        );
      } else {
        this.#addEditForm.setAttribute('add-edit', 'add');
        this.#addEditForm.setAttribute('title', 'Add Flag');
        this.#addEditForm.setAttribute(
          'subtitle',
          'New flags will be enabled in all environments by default.'
        );
      }
      this.#addEditForm.setAttribute('fields', JSON.stringify(fields));
    } else {
      this.#addEditForm.removeAttribute('show');
    }
  }

  #updateCustomTableBody() {
    const colOpts = tableOptions[this.#db].headers;
    const rowOpts = tableOptions[this.#db].rows;
    const rows = this.#pagedFlags[this.#currentPageForArray].map((item) => {
      const entries = Object.entries(item);
      return {
        id: item.id,
        ...Object.assign(
          {},
          ...colOpts.map((opt, index) => {
            // +1 to index due to row having id at 0
            const cell = entries[index + 1];
            if (cell) {
              let str;
              if (opt.type === 'date') {
                str = this.#formatDate(cell[1]);
              } else {
                str = cell[1];
              }
              return { [cell[0]]: str };
            }
          })
        ),
      };
    });

    this.#tableBody.setAttribute('rows', JSON.stringify(rows));
    this.#tableBody.setAttribute('row-options', JSON.stringify(rowOpts));
    this.#tableBody.setAttribute('col-options', JSON.stringify(colOpts));
  }

  #updateCustomTableHead() {
    this.#tableHead.setAttribute(
      'columns',
      JSON.stringify(tableOptions[this.#db].headers)
    );
    this.#tableHead.setAttribute('sort-by', this.#sortBy.id);
    this.#tableHead.setAttribute('sort-direction', this.#sortBy.direction);
  }

  #updateCustomTablePagination() {
    const flatArr = this.#pagedFlags.flat();
    const showingStart = this.#currentPageForArray * this.#perPage + 1;
    const showingEnd =
      showingStart + this.#pagedFlags[this.#currentPageForArray].length - 1;
    const totalPages = this.#pagedFlags.length;

    this.#pagination.setAttribute('showing-start', showingStart);
    this.#pagination.setAttribute('showing-end', showingEnd);
    this.#pagination.setAttribute('total-rows', `${flatArr.length}`);
    this.#pagination.setAttribute('current-page', this.#currentPage);
    this.#pagination.setAttribute('total-pages', totalPages);
    this.#checkPaginationButtons();
  }

  /*  ------ Create/Build Components ------ */
  #buildActionButton(item, action) {
    const button = document.createElement('button');
    const icon = document.createElement('i');

    if (action === 'delete') {
      button.classList.add('icon', 'delete');
      icon.classList.add('fa-solid', 'fa-trash', 'fa-lg');
      button.addEventListener('click', () => {
        this.handleDeleteFlag(item.id);
      });
    } else if (action === 'edit') {
      button.classList.add('icon', 'edit');
      icon.classList.add('fa-solid', 'fa-pencil', 'fa-lg');
      button.addEventListener('click', () => {
        dbClass.handleAddEditFormOpen('update', item);
      });
    }

    button.append(icon);
    return button;
  }

  #buildActionCell(params) {
    const { row, rowOpt } = params;
    const td = document.createElement('td');
    const div = document.createElement('div');
    div.classList.add('actions');
    div.append(this.#buildActionButton(row, 'delete'));
    div.append(this.#buildActionButton(row, 'edit'));

    if (rowOpt.includeToggle) {
      const toggle = this.#createToggleButton(row, rowOpt.toggle);
      div.append(toggle);
    }

    td.append(div);
    return td;
  }

  #buildCell(params) {
    const { cellData, row, rowOpt } = params;
    const td = document.createElement('td');
    const div = document.createElement('div');
    const whichToggles = {
      mark: !cellData ? 'xmark' : 'check',
      button: !cellData ? 'on' : 'off',
    };

    if (rowOpt.divClassList) {
      div.classList.add(...rowOpt.divClassList);
    }

    if (rowOpt.isToggleColumn) {
      const icon = document.createElement('i');
      icon.classList.add('fa', `fa-${whichToggles.mark}`, 'fa-lg');
      div.append(icon);

      if (rowOpt.includeToggle) {
        const toggle = this.#createToggleButton(row, rowOpt.toggle);
        div.append(toggle);
      }
    } else {
      div.innerText = cellData;
    }

    td.append(div);
    return td;
  }

  #createPageContent() {
    const addNewButton = this.#htmlCreateButton({
      type: 'button',
      label: 'Create New',
      className: 'primary',
      clickHandler: () => {
        this.handleAddEditFormOpen(formTypes.create);
      },
      icon: 'plus',
    });
    const searchForm = this.#createSearchForm();

    this.#content.innerHTML = `
      <div class="stack stack-gap-large">
        <div class='stack stack-no-gap'>
          <div class='title'>
            <div class='search-form'></div>
          </div>
          
          <table class="table table-bordered">
            <thead is="custom-table-head"></thead>
            <tbody is="custom-table-body"></tbody>
          </table>
          <div is="custom-table-pagination" class="pagination"></div>
        </div>
        
        <div class='form-wrapper'>
          <form is="custom-form" id="add-edit-form" class="stack"></form>
        </div>
      </div>
    `;
    const title = this.#content.querySelector('.title');
    title.appendChild(addNewButton);
    const search = this.#content.querySelector('.search-form');
    search.appendChild(searchForm);

    this.#tableHead = this.#content.querySelector('thead');
    this.#tableBody = this.#content.querySelector('tbody');
    this.#pagination = this.#content.querySelector('.pagination');
    this.#addEditForm = this.#content.querySelector('form#add-edit-form');

    this.#updateCustomTableHead();
    this.#updateCustomTableBody();
    this.#updateCustomTablePagination();
  }

  #createSearchForm() {
    const form = document.createElement('form');
    form.className = 'form-inline';

    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    const label = document.createElement('label');
    label.className = 'sr-only';
    label.setAttribute('for', 'search');
    label.textContent = 'Search';

    const input = document.createElement('input');
    input.className = 'form-control';
    input.setAttribute('type', 'search');
    input.setAttribute('id', 'search');
    input.setAttribute('placeholder', 'Search');
    input.addEventListener('keyup', () => {
      this.handleSearchChange(input.value);
    });

    const cancelButton = this.#htmlCreateButton({
      type: 'button',
      label: 'Cancel',
      className: 'secondary',
      clickHandler: () => {
        input.value = '';
        this.handleSearchChange('');
      },
    });

    formGroup.append(label, input, cancelButton);
    form.append(formGroup);
    return form;
  }

  #createToggleButton(row, key) {
    const button = document.createElement('button');
    button.classList.add('icon', 'toggle');

    const icon = document.createElement('i');
    icon.classList.add('fas', `fa-toggle-${row[key] ? 'off' : 'on'}`, 'fa-lg');

    button.addEventListener('click', () => {
      this.handleToggleFlag(row.id, key, !row[key]);
    });

    button.appendChild(icon);
    return button;
  }

  /* ------ Public methods ------ */
  createAddEditFormButton(type) {
    if (type === 'submit') {
      return this.#htmlCreateButton({
        type: 'button',
        className: 'primary',
        label: 'Submit',
        clickHandler: this.handleAddEditFormSubmit.bind(this),
      });
    }

    return this.#htmlCreateButton({
      type: 'button',
      className: 'secondary',
      label: 'Cancel',
      clickHandler: this.handleAddEditFormCancel.bind(this),
    });
  }

  createPaginationButton(direction) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.addEventListener('click', () => {
      this.handlePageChange(direction);
      this.#checkPaginationButtons();
    });
    const icon = document.createElement('i');
    icon.classList.add(
      'fa-solid',
      `fa-caret-${direction === 'prev' ? 'left' : 'right'}`
    );
    button.append(icon);

    if (direction === 'prev') {
      this.#prevButton = button;
    } else {
      this.#nextButton = button;
    }

    return button;
  }

  createTableRowCell(params, isActions = false) {
    if (isActions) {
      return this.#buildActionCell(params);
    } else {
      return this.#buildCell(params);
    }
  }

  handleAddEditFormCancel() {
    this.#updateAddEditForm(false);
    this.#editing = null;
  }

  handleAddEditFormOpen(formType, flag) {
    if (formType === formTypes.update) {
      this.#editing = flag;
    } else {
      this.#editing = null;
    }
    this.#updateAddEditForm(true);
  }

  handleAddEditFormSubmit() {
    const name = this.#addEditForm.querySelector('#name').value;
    const description = this.#addEditForm.querySelector('#description').value;
    let queryData = `name: "${name}", description: "${description}"`;

    if (this.#editing === null) {
      this.addFlag(queryData);
    } else {
      queryData += `, id: ${this.#editing.id}`;
      this.editFlag(queryData);
    }
  }

  handleDeleteFlag(id) {
    this.deleteFlag(id);
  }

  handlePageChange(direction) {
    if (direction === 'prev' && this.#currentPage > 1) {
      this.#currentPage--;
      this.#currentPageForArray--;
    } else if (
      direction === 'next' &&
      this.#currentPage < this.#pagedFlags.length
    ) {
      this.#currentPage++;
      this.#currentPageForArray++;
    }
    this.#updateCustomTableBody();
    this.#updateCustomTablePagination();
  }

  handleSearchChange(searchString) {
    this.#searchString = searchString.toLowerCase();
    this.#setPage(1);
    this.#createPagedFlags();
    this.#updateCustomTableBody();
    this.#updateCustomTablePagination();
  }

  handleSortClick(id) {
    if (this.#sortBy.id === id) {
      this.#sortBy.direction = this.#toggleDirection(this.#sortBy.direction);
    } else {
      this.#sortBy = { id, direction: 'asc' };
    }
    this.#setPage(1);
    this.#sortColumn();
    this.#createPagedFlags();
  }

  handleToggleFlag(id, key, bool) {
    this.toggleFlag(id, key, bool);
  }

  updateCasing(str) {
    return str
      .split(' ')
      .map((word) => word.toLowerCase().replace(/[^A-Za-z0-9-]/gi, ''))
      .join('-');
  }

  /* ------ Setup ------ */
  #setup() {
    // setup sortBy
    if (!Object.keys(this.#sortBy).length) {
      const defaultColumn = tableOptions[this.#db].headers.find((header) => {
        return header.defaultSort;
      });
      if (defaultColumn) {
        this.#sortBy = {
          id: defaultColumn.id,
          direction: defaultColumn.defaultSort,
        };
      }
    }

    // setup default sorting
    this.#sortColumn();

    // setup paged flags
    this.#createPagedFlags();

    // create page content
    this.#createPageContent();
  }

  /* ------ Initialize ------ */
  initialize() {
    const { body, headers, method, url } = this.#buildQuery('get');
    fetch(url, { method, headers, body })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          throw new Error(res.errors[0].message);
        }
        this.#allFlags = res.data[graphQlOptions[this.#db].queries.get];
        this.#setup();
      })
      .catch((err) => console.error(err));
  }
}

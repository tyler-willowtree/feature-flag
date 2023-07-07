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
      example: 'createExampleFlag',
    },
    returns: [
      'id',
      'name',
      'description',
      'enabled',
      'enablePercentage',
      'onCount',
      'offCount',
      'updatedAt',
    ],
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
      example: 'createExampleFlagSDB',
    },
    returns: [
      'id',
      'name',
      'description',
      'localEnabled',
      'stagingEnabled',
      'productionEnabled',
      'localEnablePercentage',
      'stagingEnablePercentage',
      'productionEnablePercentage',
      'localOnCount',
      'localOffCount',
      'stagingOnCount',
      'stagingOffCount',
      'productionOnCount',
      'productionOffCount',
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
        sortable: true,
        type: 'boolean',
        defaultSort: 'desc',
        width: '120px',
      },
      {
        id: 'enablePercentage',
        label: 'A/B',
        sortable: true,
        type: 'ab-test',
        width: '100px',
      },
      {
        id: 'updatedAt',
        label: 'Updated',
        divClassList: ['row-reverse'],
        sortable: true,
        type: 'date',
        width: '110px',
      },
      {
        id: 'actions',
        label: 'Actions',
        divClassList: ['text-center'],
        sortable: false,
        type: 'actions',
        width: '120px',
      },
    ],
    rows: [
      { id: 'name' },
      { id: 'description' },
      {
        id: 'enabled',
        isToggleColumn: true,
        includeToggle: true,
        toggle: 'enabled',
      },
      { id: 'enablePercentage', type: 'ab-test' },
      { id: 'updatedAt', divClassList: ['text-end'], type: 'date' },
      { id: 'actions' },
    ],
  },
  shared: {
    headers: [
      {
        id: 'name',
        label: 'Name',
        sortable: true,
        type: 'text',
      },
      {
        id: 'description',
        label: 'Description',
        sortable: true,
        type: 'text',
      },
      {
        id: 'localEnabled',
        label: 'Local',
        sortable: true,
        type: 'boolean',
        defaultSort: 'desc',
        width: '130px',
      },
      {
        id: 'stagingEnabled',
        label: 'Staging',
        sortable: true,
        type: 'boolean',
        width: '130px',
      },
      {
        id: 'productionEnabled',
        label: 'Production',
        sortable: true,
        type: 'boolean',
        width: '130px',
      },
      {
        id: 'updatedAt',
        label: 'Updated',
        divClassList: ['row-reverse'],
        sortable: true,
        type: 'date',
        width: '110px',
      },
      {
        id: 'actions',
        label: 'Actions',
        divClassList: ['text-center'],
        sortable: false,
        type: 'actions',
        width: '120px',
      },
    ],
    rows: [
      { id: 'name' },
      { id: 'description' },
      {
        id: 'localEnabled',
        includeToggle: true,
        toggle: 'localEnabled',
        isToggleColumn: true,
      },
      {
        id: 'stagingEnabled',
        includeToggle: true,
        toggle: 'stagingEnabled',
        isToggleColumn: true,
      },
      {
        id: 'productionEnabled',
        includeToggle: true,
        toggle: 'productionEnabled',
        isToggleColumn: true,
      },
      { id: 'updatedAt', divClassList: ['text-end'], type: 'date' },
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
    if (variables) {
      return this.#getApiConfig(`mutation ${mutations[name]} {
        ${mutations[name]}(${variables}) {
          ${returns.join('\n')}
        }
      }`);
    }
    return this.#getApiConfig(`mutation ${mutations[name]} {
      ${mutations[name]} {
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
    if (!this.#pagedFlags.length) {
      this.#pagedFlags.push([]);
    }

    if (
      this.#currentPageForArray > 0 &&
      !this.#pagedFlags[this.#currentPageForArray]
    ) {
      this.handlePageChange('prev');
    }
  }

  #formatDate(date) {
    return dayjs(date).format('MMM DD, YY<br/>h:mm a');
  }

  #getApiConfig(query) {
    return {
      url: '/graphql',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    };
  }

  #getColumnTypeFunction(type, params) {
    switch (type) {
      case 'boolean':
        return this.#buildCellBoolean(params);
      case 'date':
        return this.#buildCellDate(params);
      case 'ab-test':
        return this.#buildCellAbTest(params);
      case 'text':
      default:
        return this.#buildCellText(params);
    }
  }

  #htmlCreateButton({
    type,
    className,
    icon,
    label,
    clickHandler,
    extraClasses,
  }) {
    const button = document.createElement('button');
    button.type = type;
    button.classList.add('btn', `btn-${className}`);
    if (extraClasses) {
      button.classList.add(...extraClasses);
    }
    button.textContent = label;
    button.addEventListener('click', clickHandler);
    if (icon) {
      const iconEl = document.createElement('i');
      iconEl.classList.add('fa-solid', `fa-${icon}`);
      button.prepend(iconEl);
    }
    return button;
  }

  #htmlCreateIconButton({ icon, clickHandler, type }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-icon', type);
    button.addEventListener('click', clickHandler);
    const iconEl = document.createElement('i');
    iconEl.classList.add('fa-solid', `fa-${icon}`, 'fa-lg');
    button.appendChild(iconEl);
    return button;
  }

  #transformData(data) {
    const row = tableOptions[this.#db].headers;
    const colType = row.find((cell) => this.#sortBy.id === cell.id).type;
    if (colType === 'date') {
      return dayjs(data);
    } else if (colType === 'boolean') {
      return Boolean(data);
    } else if (colType === 'number' || colType === 'percent') {
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
    if (this.#pagedFlags[0].length) {
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
          extraText: 'Max 25 characters',
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
    this.#tableBody.setAttribute(
      'rows',
      JSON.stringify(this.#pagedFlags[this.#currentPageForArray])
    );
    this.#tableBody.setAttribute(
      'row-options',
      JSON.stringify(tableOptions[this.#db].rows)
    );
    this.#tableBody.setAttribute(
      'col-options',
      JSON.stringify(tableOptions[this.#db].headers)
    );
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
  #buildCell(params) {
    const { colOption, rowOpt, index } = params;
    const td = document.createElement('td');
    if (index === 0) {
      td.setAttribute('scope', 'row');
    }
    const div = document.createElement('div');
    div.classList.add('lh-sm');
    td.append(div);

    if (rowOpt.divClassList) {
      div.classList.add(...rowOpt.divClassList);
    }

    this.#getColumnTypeFunction(colOption.type, { ...params, div, td });

    return td;
  }

  #buildCellAbTest(params) {
    const { row, div } = params;
    div.classList.add('text-center');
    let str;

    const percent = row.enablePercentage;
    if (Number(percent) === 100) {
      str = `n/a`;
    } else {
      str = `<div class='mb-1'>${percent}%</div>`;
      if (Number(percent) !== 100) {
        str += `<div class='small'><u>Counts</u><br/>${row.onCount} / ${row.offCount}</div>`;
      }
    }
    div.innerHTML = str;
  }

  #buildCellAction(params) {
    const { row, rowOpt } = params;
    const td = document.createElement('td');
    const div = document.createElement('div');
    div.classList.add(
      'd-flex',
      'align-items-center',
      'justify-content-between'
    );

    const delButton = this.#htmlCreateIconButton({
      icon: 'trash',
      clickHandler: () => this.handleDeleteFlag(row.id),
      type: 'delete',
    });

    const editButton = this.#htmlCreateIconButton({
      icon: 'pencil',
      clickHandler: () => dbClass.handleAddEditFormOpen('update', row.id),
      type: 'edit',
    });

    div.append(delButton);
    div.append(editButton);

    if (rowOpt.includeToggle) {
      const toggleBtn = this.#htmlCreateIconButton({
        icon: row[rowOpt.toggle] ? 'toggle-off' : 'toggle-on',
        clickHandler: () =>
          this.handleToggleFlag(row.id, rowOpt.toggle, !row[rowOpt.toggle]),
        type: 'toggle',
      });
      div.append(toggleBtn);
    }

    td.append(div);
    return td;
  }

  #buildCellBoolean(params) {
    const { cellData, row, rowOpt, div, td } = params;

    div.classList.add(
      'd-flex',
      'justify-content-between',
      'align-items-center',
      this.#db === 'own' ? 'ps-3' : 'ps-2'
    );

    const icon = document.createElement('i');
    icon.classList.add(
      'fa-solid',
      `fa-${!cellData ? 'xmark' : 'check'}`,
      'fa-lg'
    );
    div.append(icon);

    if (rowOpt.includeToggle) {
      const toggleBtn = this.#htmlCreateIconButton({
        icon: row[rowOpt.toggle] ? 'toggle-off' : 'toggle-on',
        clickHandler: () =>
          this.handleToggleFlag(row.id, rowOpt.toggle, !row[rowOpt.toggle]),
        type: 'toggle',
      });
      div.append(toggleBtn);
    }

    if (this.#db === 'shared') {
      const abDiv = document.createElement('div');
      abDiv.classList.add('ps-2', 'small');
      let str;
      const env = rowOpt.toggle.replace('Enabled', '');
      const percent = row[`${env}EnablePercentage`];
      str = `<div>A/B: ${percent}%</div>`;
      if (Number(percent) !== 100) {
        str += `<div>Counts: ${row[`${env}OnCount`]} / ${
          row[`${env}OffCount`]
        }</div>`;
      }
      abDiv.innerHTML = str;
      td.append(abDiv);
    }
  }

  #buildCellDate(params) {
    const { cellData, div } = params;
    div.innerHTML = this.#formatDate(cellData);
  }

  #buildCellText(params) {
    const { cellData, div } = params;
    div.innerHTML = cellData;
  }

  #createPageContent() {
    this.#content.innerHTML = `
      <div id="top-section" class='d-flex align-items-center mb-2'></div>
      
      <table class="table table-bordered border-primary align-middle">
        <thead is="custom-table-head"></thead>
        <tbody is="custom-table-body" class="table-group-divider border-primary"></tbody>
      </table>
      
      <div
        is="custom-table-pagination"
        id="pagination"
        class='d-flex align-items-center align-items-center'
       ></div>
      
      <form is="custom-form" id="add-edit-form" class="mt-5"></form>
    `;

    const topSection = this.#content.querySelector('#top-section');
    topSection.append(...this.#createTopSection());

    this.#tableHead = this.#content.querySelector('thead');
    this.#tableBody = this.#content.querySelector('tbody');
    this.#pagination = this.#content.querySelector('#pagination');
    this.#addEditForm = this.#content.querySelector('form#add-edit-form');

    this.#updateCustomTableHead();
    this.#updateCustomTableBody();
    this.#updateCustomTablePagination();
  }

  #createSearchForm() {
    const form = document.createElement('form');
    form.classList.add('row', 'row-cols-lg-auto', 'g-0', 'align-items-center');

    const inputWrapper = document.createElement('div');

    const label = document.createElement('label');
    label.classList.add('visually-hidden');
    label.setAttribute('for', 'search');
    label.textContent = 'Search';

    const input = document.createElement('input');
    input.id = 'search';
    input.classList.add('form-control');
    input.setAttribute('type', 'search');
    input.setAttribute('placeholder', 'Search');
    input.addEventListener('keyup', () => {
      this.handleSearchChange(input.value);
    });

    inputWrapper.append(label, input);

    const cancelButton = this.#htmlCreateButton({
      type: 'button',
      label: 'Cancel',
      className: 'secondary',
      clickHandler: () => {
        input.value = '';
        this.handleSearchChange('');
      },
    });

    form.append(inputWrapper, cancelButton);
    return form;
  }

  #createTopSection() {
    const searchForm = this.#createSearchForm();
    const addNewButton = this.#htmlCreateButton({
      type: 'button',
      label: 'Create New',
      className: 'primary',
      clickHandler: () => {
        this.handleAddEditFormOpen(formTypes.create);
      },
      icon: 'plus',
      extraClasses: ['ms-auto'],
    });

    return [searchForm, addNewButton];
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

  createPerPageInput() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('row', 'row-cols-auto', 'g-3', 'align-items-center');

    const label = document.createElement('div');
    label.textContent = 'Per page';

    const inputWrapper = document.createElement('div');

    const select = document.createElement('select');
    select.classList.add('form-select');
    select.setAttribute('aria-label', 'Rows per page');
    select.addEventListener('change', (e) => {
      this.#perPage = Number(e.target.value);
      this.#currentPage = 1;
      this.#currentPageForArray = 0;
      this.#createPagedFlags();
      this.handlePageChange('next');
    });
    const options = [
      { label: '5', value: '5' },
      { label: '10', value: '10' },
      { label: '15', value: '15' },
      { label: '20', value: '20' },
    ];
    options.forEach((opt) => {
      const option = document.createElement('option');
      option.setAttribute('value', opt.value);
      option.textContent = opt.label;
      if (this.#perPage === Number(opt.value)) {
        option.setAttribute('selected', '');
      }
      select.append(option);
    });
    inputWrapper.append(select);

    wrapper.append(inputWrapper, label);
    return wrapper;
  }

  createTableRowCell(params, isActions = false) {
    if (isActions) {
      return this.#buildCellAction(params);
    } else {
      return this.#buildCell(params);
    }
  }

  handleAddEditFormCancel() {
    this.#updateAddEditForm(false);
    this.#editing = null;
  }

  handleAddEditFormOpen(formType, id) {
    if (formType === formTypes.update) {
      const flag = this.#pagedFlags[this.#currentPageForArray].find(
        (f) => f.id === id
      );
      this.#editing = flag || null;
    } else {
      this.#editing = null;
    }
    this.#updateAddEditForm(true);
  }

  handleAddEditFormSubmit() {
    const inputs = this.#addEditForm.querySelectorAll('input');
    const queryItems = ['data: {'];

    inputs.forEach((input) => {
      if (input.type === 'checkbox') {
        queryItems.push(`${input.id}: ${input.checked}`);
      } else if (input.type === 'number') {
        queryItems.push(`${input.id}: ${input.value}`);
      } else {
        queryItems.push(`${input.id}: "${input.value}"`);
      }
    });
    queryItems.push('}');

    if (this.#editing === null) {
      this.addFlag(queryItems.join(','));
    } else {
      this.editFlag(`id: ${this.#editing.id}, ${queryItems.join(',')}`);
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
    this.#updateCustomTableHead();
    this.#updateCustomTableBody();
    this.#updateCustomTablePagination();
  }

  handleToggleFlag(id, key, bool) {
    this.toggleFlag(id, key, bool);
  }

  updateCasing(str) {
    return str
      .split(' ')
      .map((word) => word.toLowerCase().replace(/[^A-Za-z0-9-]/gi, ' '))
      .join('-');
  }

  async updateDbWithExamples() {
    const arr = [];
    arr.length = 10;
    arr.fill(this.#buildMutation('example'));

    const callEach = async (theMeat) => {
      const fetchData = await fetch(theMeat.url, {
        method: theMeat.method,
        headers: theMeat.headers,
        body: theMeat.body,
      });
      return fetchData.json();
    };

    await Promise.all(arr.map((bod) => callEach(bod))).then((res) => {
      res.forEach((item) => {
        const flag = item.data[graphQlOptions[this.#db].mutations.example];
        this.#allFlags.push(flag);
      });
      this.#setPage(1);
      this.#sortColumn();
      this.#createPagedFlags();
      this.#updateCustomTableHead();
      this.#updateCustomTableBody();
      this.#updateCustomTablePagination();
    });
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

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
        class: ['column-150'],
        sortable: true,
        type: 'boolean',
        // defaultSort: 'asc',
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
        class: ['column-140'],
        sortable: true,
        type: 'boolean',
        defaultSort: 'desc',
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
      { id: 'updatedAt', divClassList: ['text-right'], type: 'date' },
      { id: 'actions' },
    ],
  },
};

const dbOptions = ['own', 'shared'];
const formTypes = { create: 'create', update: 'update' };

/* NOTE: dayjs must be included in the head prior to this file */
class PageSetup {
  // private items
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
  #searchForm;
  #tableHead;
  #tableBody;
  #pagination;
  #addEditForm;

  constructor(type) {
    if (dbOptions.includes(type)) {
      console.group(`Initializing for "${type}"`);
      this.#db = type;
      this.#content = document.getElementById('content');
      this.initialize();
    } else {
      throw new Error(`Invalid database type: "${type}"`);
    }
  }

  /* General Methods */
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

  #buildQuery(name) {
    const { queries, returns } = graphQlOptions[this.#db];
    return this.#getApiConfig(`query ${queries[name]} {
      ${queries[name]} {
        ${returns.join('\n')}
      }
    }`);
  }

  #buildMutation(name, variables) {
    const { mutations, returns } = graphQlOptions[this.#db];
    return this.#getApiConfig(`mutation ${mutations[name]} {
      ${mutations[name]}(${variables}) {
        ${returns.join('\n')}
      }
    }`);
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

  /* Sort Methods */
  #toggleDirection(direction) {
    return direction === 'asc' ? 'desc' : 'asc';
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

  #setPage(page) {
    this.#currentPage = page;
    this.#currentPageForArray = page - 1;
  }

  /* Public methods */
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
  }

  handleSearchChange(searchString) {
    this.#searchString = searchString;
    this.#setPage(1);
    this.#createPagedFlags();
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

  handleAddEditFormCancel() {
    this.#editing = null;
    // close form
  }

  handleAddEditFormOpen(formType, flag) {
    if (formType === formTypes.update) {
      this.#editing = flag;
      // open and populate form
    }
  }

  handleAddEditFormSubmit(formType) {
    const name = this.#addEditForm.querySelector('#name').value;
    const description = this.#addEditForm.querySelector('#description').value;
    let queryData = `name: "${name}", description: "${description}"`;

    if (formType === formTypes.create) {
      this.addFlag(queryData);
    } else {
      queryData += `, id: "${this.#editing.id}"`;
      this.editFlag(queryData);
    }
  }

  handleDeleteFlag(id) {
    this.deleteFlag(id);
  }

  handleToggleFlag(id, key) {
    this.toggleFlag(id, key);
  }

  /* API Calls */
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
        }
      })
      .catch((err) => console.log(err));
  }

  toggleFlag(id, key) {
    const flag = this.#allFlags.find((flag) => flag.id === id);
    const { body, headers, method, url } = this.#buildMutation(
      'toggle',
      `id: ${id}, data: {${key}: ${!flag[key]}}`
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
        }
      })
      .catch((err) => console.log(err));
  }

  /* Setup */
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

    console.groupCollapsed('Setup');
    console.log('searchString', this.#searchString);
    console.log('sortBy', this.#sortBy);
    console.log('currentPage', this.#currentPage);
    console.log('currentPageForArray', this.#currentPageForArray);
    console.log('pagedFlags', this.#pagedFlags);
    console.groupEnd();

    // TESTS ONLY
    /*console.groupCollapsed('Add, Edit and Delete flag');
    console.groupCollapsed('Add new');
    this.handleAddNewFlag({
      id: 300,
      name: 'test-flag',
      description: 'This is a new flag',
      enabled: true,
      updatedAt: dayjs().format(),
    });
    console.log('currentPage', this.#currentPage);
    console.log('allFlags', this.#allFlags);
    console.log('pagedFlags', this.#pagedFlags);
    console.groupEnd();

    console.groupCollapsed('Edit');
    this.handleEditFlag({
      id: 300,
      name: 'test-flag',
      description: 'This is a new and edited flag',
      enabled: true,
      updatedAt: dayjs().format(),
    });
    console.log('currentPage', this.#currentPage);
    console.log('allFlags', this.#allFlags);
    console.log('pagedFlags', this.#pagedFlags);
    console.groupEnd();

    console.groupCollapsed('Delete');
    this.handleDeleteFlag(300);
    console.log('currentPage', this.#currentPage);
    console.log('allFlags', this.#allFlags);
    console.log('pagedFlags', this.#pagedFlags);
    console.groupEnd();
    console.groupEnd();*/

    /*console.groupCollapsed('Next page');
    this.handlePageChange('next');
    console.log('currentPage', this.#currentPage);
    console.log('currentPageForArray', this.#currentPageForArray);
    console.groupEnd();*/

    /*console.groupCollapsed('Sort by updatedAt');
    this.handleSortClick('updatedAt');
    console.log('sortBy', this.#sortBy);
    console.log('pagedFlags', this.#pagedFlags);
    console.log('currentPage', this.#currentPage);
    console.log('currentPageForArray', this.#currentPageForArray);
    console.groupEnd();*/

    /*console.groupCollapsed('Search for "and"');
    this.handleSearchChange('and');
    console.log('sortBy', this.#sortBy);
    console.log('searchString', this.#searchString);
    console.log('pagedFlags', this.#pagedFlags);
    console.log('currentPage', this.#currentPage);
    console.log('currentPageForArray', this.#currentPageForArray);
    console.groupEnd();*/

    console.groupEnd(); // Main group
  }

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

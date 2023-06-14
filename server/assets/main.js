/* This file is in the head of the html file */
/* eslint-disable @typescript-eslint/no-unused-vars */
const formTypeOptions = ['create', 'update'];

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
    createFlag(${data.join(', ')}) {
      id
      name
      description
      enabled
      updatedAt
    }
  }`,
  update: (id, data) => `mutation updateFlag {
    updateFlag(id: ${id}, ${data.join(', ')}) {
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
/// mutation updateFlag {\n updateFlag(id: 6, data: name: "jjdkd-khbjhb", description: "lksdjhfkwjn") {\n id\n name\n description\n enabled\n updatedAt\n }\n }'
const removeRegex = /[^A-Za-z0-9-]/gi;

const changeToParamCase = (str) => {
  return str
    .split(' ')
    .map((word) => word.toLowerCase().replace(removeRegex, ''))
    .join('-');
};

const showRealName = () => {
  const input = document.getElementById('name');
  input.value = changeToParamCase(input.value);
};

const formatDate = (date) => {
  return dayjs(date).format('MMM DD, YY h:mm a');
};

const whichToggle = (flag) => {
  if (flag.enabled) {
    return 'fa-toggle-off';
  }
  return 'fa-toggle-on';
};

const getFormElements = () => {
  const wrapper = document.getElementById('form');
  const form = wrapper.querySelector('form');
  const nameField = form.querySelector('#name');
  const descriptionField = form.querySelector('#description');

  return { descriptionField, form, nameField, wrapper };
};

const createRowHtml = (flag) => {
  return `
    <tr data-row='${flag.id}'>
      <td>${flag.name}</td>
      <td>${flag.description}</td>
      <td class='text-center'>
        <i class='fa-solid fa-check fa-lg ${
          flag.enabled ? '' : 'notEnabled'
        }'></i>
      </td>
      <td class='text-right'>${formatDate(flag.updatedAt)}</td>
      <td>
        <div style='display: flex; column-gap: 16px;'>
          <button class='icon delete' onclick='callDeleteFlag(${flag.id})'>
            <i class='fa-solid fa-xmark fa-xl'></i>
          </button>
          <button
            class='icon edit'
            onclick='toggleFormOpen("update", ${flag.id})'
          >
            <i class='fa-solid fa-pen'></i>
          </button>
          <button class='icon toggle' onclick='callToggleFlag(${flag.id})'>
            <i class='fa-solid ${whichToggle(flag)} fa-lg'></i>
          </button>
        </div>
      </td>
    </tr>
  `;
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

/** -- Flags from server -- */
let flagToEdit = null;
const str = window.flags.replaceAll('&#34;', '"');
const flags = JSON.parse(str);
const allFlags = [];
flags
  .sort((a) => (a.enabled ? -1 : 1))
  .forEach((flag) => {
    allFlags.push(createRowHtml(flag));
  });

/** -- API Calls -- */
const callToggleFlag = (id) => {
  const table = document.querySelector('tbody');
  const row = document.querySelector(`[data-row="${id}"]`);
  const index = row.rowIndex;
  const { url, body, headers, method } = getApiConfig(queries.toggle(id));

  fetch(url, {
    method,
    headers,
    body,
  })
    .then((res) => res.json())
    .then((result) => {
      table.insertRow(index - 1).innerHTML = createRowHtml(
        result.data.toggleFlag
      );
      table.deleteRow(index);
    })
    .catch((err) => console.log(err));
};

const callDeleteFlag = (id) => {
  const { url, body, headers, method } = getApiConfig(queries.delete(id));
  fetch(url, {
    method,
    headers,
    body,
  })
    .then((res) => res.json())
    .then(() => {
      document.querySelector(`[data-row="${id}"]`).remove();
    })
    .catch((err) => console.log(err));
};

/** -- Form -- */
const toggleFormOpen = (which, id = null) => {
  const { descriptionField, form, nameField, wrapper } = getFormElements();

  if (formTypeOptions.includes(which)) {
    if (wrapper.classList.contains(which)) {
      wrapper.classList.remove(which);
      wrapper.classList.add('hidden');
      form.reset();
    } else {
      if (which === 'update' && id) {
        flagToEdit = flags.find((flag) => flag.id === id);
        nameField.value = flagToEdit.name;
        descriptionField.value = flagToEdit.description;
      }
      wrapper.classList.add(which);
      wrapper.classList.remove('hidden');
    }
  }
};

const getWhichFormIsOpen = () => {
  const { wrapper } = getFormElements();
  const formClassList = wrapper.classList;
  return formTypeOptions.find((option) => formClassList.contains(option));
};

const handleCancelForm = () => {
  const opt = getWhichFormIsOpen();
  if (opt) {
    toggleFormOpen(opt);
  }
};

const submitForm = () => {
  const { form } = getFormElements();
  const whichCall = getWhichFormIsOpen();
  const formData = new FormData(form);
  const data = [];
  for (const [key, value] of formData.entries()) {
    data.push(`${key}: ${typeof value === 'string' ? `"${value}"` : value}`);
  }

  let callData;
  if (whichCall === 'create') {
    callData = getApiConfig(queries.create(data));
  } else {
    callData = getApiConfig(queries.update(flagToEdit.id, data));
  }
  fetch(callData.url, {
    method: callData.method,
    headers: callData.headers,
    body: callData.body,
  })
    .then((res) => res.json())
    .then((result) => {
      if (whichCall === 'create') {
        document.querySelector('tbody').insertRow(0).innerHTML = createRowHtml(
          result.data.createFlag
        );
      } else {
        const row = document.querySelector(`[data-row="${flagToEdit.id}"]`);
        row.innerHTML = createRowHtml(result.data.updateFlag);
      }
      handleCancelForm();
    })
    .catch((err) => console.log(err));
};

/** -- Search -- */
const handleSearch = () => {
  const input = document.getElementById('search');
  const filter = input.value.toUpperCase();
  const rows = tableBody.querySelectorAll('tr');

  [].forEach.call(rows, (row) => {
    const cells = row.querySelectorAll('td');
    let found = false;
    [].forEach.call(cells, (cell) => {
      if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
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

const handleClearSearch = () => {
  document.getElementById('search').value = '';
  handleSearch();
};

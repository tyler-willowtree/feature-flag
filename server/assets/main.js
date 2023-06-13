/* This file is in the head of the html file */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

const createPost = (query) => {
  return {
    url: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  };
};

const createRow = (flag) => {
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
          <button class='icon' onclick='deleteFlag(${flag.id})'>
            <i class='fa-solid fa-xmark fa-xl'></i>
          </button>
          <button class='icon toggle' onclick='toggleFlag(${flag.id})'>
            <i class='fa-solid ${whichToggle(flag)} fa-lg'></i>
          </button>
        </div>
      </td>
    </tr>
  `;
};

const toggleFlag = (id) => {
  const table = document.querySelector('tbody');
  const row = document.querySelector(`[data-row="${id}"]`);
  const index = row.rowIndex;
  const { url, body, headers, method } = createPost(queries.toggle(id));

  fetch(url, {
    method,
    headers,
    body,
  })
    .then((res) => res.json())
    .then((result) => {
      table.insertRow(index - 1).innerHTML = createRow(result.data.toggleFlag);
      table.deleteRow(index);
    })
    .catch((err) => console.log(err));
};

const deleteFlag = (id) => {
  const { url, body, headers, method } = createPost(queries.delete(id));
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

const addNewFlag = () => {
  document.getElementById('form').classList.remove('notEnabled');
};

const submitForm = () => {
  const theForm = document.getElementById('form').querySelector('form');
  const formData = new FormData(theForm);
  const data = [];
  for (const [key, value] of formData.entries()) {
    data.push(`${key}: ${typeof value === 'string' ? `"${value}"` : value}`);
  }

  const { url, body, headers, method } = createPost(queries.create(data));
  fetch(url, {
    method,
    headers,
    body,
  })
    .then((res) => res.json())
    .then((result) => {
      theForm.reset();
      document.querySelector('tbody').insertRow(0).innerHTML = createRow(
        result.data.createFlag
      );
      document.getElementById('form').classList.add('notEnabled');
    })
    .catch((err) => console.log(err));
};

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

const clearSearch = () => {
  document.getElementById('search').value = '';
  handleSearch();
};

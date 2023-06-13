/* eslint-disable @typescript-eslint/no-unused-vars */
const formatDate = (date) => {
  return dayjs(date).format('MMM DD, YY');
};

const whichToggle = (flag) => {
  if (flag.enabled) {
    return 'fa-toggle-off';
  }
  return 'fa-toggle-on';
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
  fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `mutation ToggleFlag {
                toggleFlag(id: ${id}) {
                  id
                  name
                  description
                  enabled
                  updatedAt
                }
              }`,
    }),
  })
    .then((res) => res.json())
    .then(() => {
      window.location.reload();
    })
    .catch((err) => console.log(err));
};

const deleteFlag = (id) => {
  fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `mutation DeleteFlag {
                deleteFlag(id: ${id}) {
                  id
                  name
                  description
                  enabled
                  updatedAt
                }
              }`,
    }),
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
  console.log('submit');
  const theForm = document.getElementById('form').querySelector('form');
  const formData = new FormData(theForm);
  const data = [];
  for (const [key, value] of formData.entries()) {
    data.push(`${key}: ${typeof value === 'string' ? `"${value}"` : value}`);
  }

  fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `mutation CreateFlag {
                createFlag(${data.join(', ')}) {
                  id
                  name
                  description
                  enabled
                  updatedAt
                }
              }`,
    }),
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

// "mutation ToggleFlag {\n toggleFlag(id: 4) {\n id\n name\n description\n enabled\n updatedAt\n }\n }"

// 'mutation CreateFlag {\n createFlag(name: "Custom", description: "hey hey") {\n id\n name\n description\n enabled\n updatedAt\n }'

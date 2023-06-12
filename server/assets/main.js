/* eslint-disable @typescript-eslint/no-unused-vars */
const formatDate = (date) => {
  return dayjs(date).format('MMM DD, YY');
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
      document
        .querySelector(`[data-row="${id}"]`)
        .querySelector('td:nth-child(3) i')
        .classList.toggle('notEnabled');
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

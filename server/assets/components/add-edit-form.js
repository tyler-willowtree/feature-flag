class CustomFlagForm extends HTMLFormElement {
  constructor() {
    super();
  }

  connectedCallback() {
    updateFlagForm(this);
  }

  attributeChangedCallback() {
    updateFlagForm(this);
  }

  static get observedAttributes() {
    return ['show', 'title', 'subtitle', 'fields'];
  }
}

customElements.define('custom-form', CustomFlagForm, { extends: 'form' });

const updateFlagForm = (element) => {
  const show = element.getAttribute('show');
  const fieldsStr = element.getAttribute('fields');
  if (!show || !fieldsStr) {
    element.innerHTML = '';
    return null;
  }

  const title = element.getAttribute('title');
  const subtitle = element.getAttribute('subtitle');
  const fields = JSON.parse(fieldsStr);

  element.innerHTML = '';
  const hrs = [document.createElement('hr'), document.createElement('hr')];

  const header = document.createElement('h2');
  header.classList.add('text-center');
  header.innerHTML = title;

  const subHeader = document.createElement('p');
  subHeader.classList.add('text-center');
  subHeader.innerHTML = subtitle;

  const groupWrapper = document.createElement('div');
  groupWrapper.classList.add('form-group-wrapper');

  const groups = fields.map((field) => {
    const group = document.createElement('div');
    group.classList.add('mb-3');

    const label = document.createElement('label');
    label.setAttribute('for', field.name);
    label.classList.add('form-label');
    label.innerHTML = field.label;

    const input = document.createElement('input');
    input.setAttribute('type', field.type);
    input.setAttribute('value', field.value);
    input.setAttribute('id', field.name);
    input.classList.add('form-control');

    if (field.maxLength) {
      input.setAttribute('maxlength', field.maxLength);
    }
    if (field.extraText) {
      const extraText = document.createElement('div');
      extraText.classList.add('form-text', 'text-muted');
      extraText.innerHTML = field.extraText;
      group.append(extraText);
    }

    if (field.actions) {
      field.actions.forEach((action) => {
        input.addEventListener(action.name, (e) => {
          if (action.overwritesValue) {
            e.target.value = dbClass[action.functionName](e.target.value);
          }
        });
      });
    }

    if (field.type === 'number') {
      input.setAttribute('min', field.min || '0');
      input.setAttribute('max', field.max || '100');
      input.setAttribute('step', field.step || '1');
    }

    group.prepend(label, input);
    return group;
  });

  const actionsWrapper = document.createElement('div');
  actionsWrapper.classList.add('actions');
  const submit = dbClass.createAddEditFormButton('submit');
  const cancel = dbClass.createAddEditFormButton('cancel');
  actionsWrapper.append(cancel, submit);

  groupWrapper.append(...groups, actionsWrapper);

  element.append(hrs[0], header, subHeader, groupWrapper, hrs[1]);
};

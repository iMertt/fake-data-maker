import { firstName, lastName, username, email, creditCard } from "/dist/index.js";

const generatorByField = {
  firstName,
  lastName,
  username,
  email,
  creditCard
};

const countInput = document.getElementById("count");
const filterInput = document.getElementById("filter");
const result = document.getElementById("result");
const meta = document.getElementById("meta");
const generateButton = document.getElementById("generate");
const copyButton = document.getElementById("copy");
const addFieldButton = document.getElementById("addField");
const refreshFieldsButton = document.getElementById("refreshFields");
const fieldAliasInput = document.getElementById("fieldAlias");
const fieldSourceSelect = document.getElementById("fieldSource");
const availableFieldsContainer = document.getElementById("availableFields");
const selectedFieldsContainer = document.getElementById("selectedFields");

let availableFields = [];
let selectedFields = [];

const normalizeAlias = (alias) => {
  const clean = alias.trim().replace(/[^a-zA-Z0-9_]/g, "_");
  return clean.length > 0 ? clean : "field";
};

const makeRecord = (fields) => {
  const record = {};

  for (const field of fields) {
    const generate = generatorByField[field.source];
    if (generate) {
      record[field.alias] = generate();
    }
  }

  return record;
};

const matchesFilter = (record, rawFilter) => {
  if (!rawFilter) return true;
  const filter = rawFilter.toLowerCase();

  return Object.values(record).some((value) => String(value).toLowerCase().includes(filter));
};

const renderSelectedFields = () => {
  selectedFieldsContainer.textContent = "";

  if (selectedFields.length === 0) {
    const empty = document.createElement("li");
    empty.className = "selected-item";
    empty.textContent = "No fields selected.";
    selectedFieldsContainer.append(empty);
    return;
  }

  for (const field of selectedFields) {
    const item = document.createElement("li");
    item.className = "selected-item";

    const text = document.createElement("span");
    const strong = document.createElement("b");
    strong.textContent = field.alias;
    const sourceText = document.createTextNode(` <- ${field.source}`);
    text.append(strong, sourceText);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-ghost";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      selectedFields = selectedFields.filter((candidate) => candidate.id !== field.id);
      renderSelectedFields();
      generateData();
    });

    item.append(text, removeButton);
    selectedFieldsContainer.append(item);
  }
};

const addSelectedField = (source, alias = source) => {
  const normalized = normalizeAlias(alias);
  const id = `${normalized}_${source}_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`;

  selectedFields.push({ id, source, alias: normalized });
  renderSelectedFields();
};

const renderFieldSourceOptions = () => {
  fieldSourceSelect.textContent = "";

  for (const field of availableFields) {
    const option = document.createElement("option");
    option.value = field.field;
    option.textContent = `${field.field} (${field.module})`;
    fieldSourceSelect.append(option);
  }
};

const renderAvailableFields = () => {
  availableFieldsContainer.textContent = "";

  if (availableFields.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No exported generator fields found.";
    availableFieldsContainer.append(empty);
    return;
  }

  for (const field of availableFields) {
    const pill = document.createElement("div");
    pill.className = "field-pill";

    const name = document.createElement("span");
    name.textContent = field.field;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "btn btn-ghost";
    addButton.textContent = "Add";
    addButton.addEventListener("click", () => {
      addSelectedField(field.field, field.field);
      generateData();
    });

    pill.append(name, addButton);
    availableFieldsContainer.append(pill);
  }
};

const loadFields = async () => {
  const response = await fetch("/api/fields");
  const payload = await response.json();

  availableFields = payload.fields.filter((field) => generatorByField[field.field]);
  renderFieldSourceOptions();
  renderAvailableFields();

  if (selectedFields.length === 0) {
    for (const field of ["firstName", "lastName", "username", "email"]) {
      if (availableFields.some((candidate) => candidate.field === field)) {
        addSelectedField(field, field);
      }
    }
  }

  renderSelectedFields();
  generateData();
};

const generateData = () => {
  const count = Math.min(2000, Math.max(1, Number(countInput.value) || 1));

  if (selectedFields.length === 0) {
    result.textContent = "[]";
    meta.textContent = "0 records (add at least one field)";
    return;
  }

  const data = [];
  for (let i = 0; i < count; i += 1) {
    data.push(makeRecord(selectedFields));
  }

  const filtered = data.filter((record) => matchesFilter(record, filterInput.value));
  result.textContent = JSON.stringify(filtered, null, 2);
  meta.textContent = `${filtered.length} records | ${selectedFields.length} fields`;
};

generateButton.addEventListener("click", generateData);

addFieldButton.addEventListener("click", () => {
  const source = fieldSourceSelect.value;
  const alias = fieldAliasInput.value || source;

  if (!source) return;

  addSelectedField(source, alias);
  fieldAliasInput.value = "";
  generateData();
});

refreshFieldsButton.addEventListener("click", async () => {
  await loadFields();
});

countInput.addEventListener("change", generateData);
filterInput.addEventListener("input", generateData);

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(result.textContent ?? "[]");
});

loadFields();

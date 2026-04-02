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

const required = [
  countInput,
  filterInput,
  result,
  meta,
  generateButton,
  copyButton,
  addFieldButton,
  refreshFieldsButton,
  fieldAliasInput,
  fieldSourceSelect,
  availableFieldsContainer,
  selectedFieldsContainer
];

if (required.some((el) => !el)) {
  console.error("nanofake playground: missing required DOM elements.");
}

let availableFields = [];
let selectedFields = [];

const MAX_FILTER_ATTEMPTS = 50_000;

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

const parseCount = (raw) => Math.min(2000, Math.max(1, Number(raw) || 1));

/**
 * Builds records. With an active filter, generates until `count` matches or cap is hit.
 */
const buildRecords = (fields, count, filterRaw) => {
  if (!filterRaw) {
    const data = [];
    for (let i = 0; i < count; i += 1) {
      data.push(makeRecord(fields));
    }
    return { records: data, capped: false };
  }

  const filtered = [];
  let attempts = 0;
  while (filtered.length < count && attempts < MAX_FILTER_ATTEMPTS) {
    const record = makeRecord(fields);
    if (matchesFilter(record, filterRaw)) filtered.push(record);
    attempts += 1;
  }

  return { records: filtered, capped: filtered.length < count };
};

const renderOutput = (records, fieldsCount, filterRaw, capped) => {
  if (!result || !meta) return;
  result.textContent = JSON.stringify(records, null, 2);
  const filterNote = filterRaw && capped ? " (filter cap reached)" : "";
  meta.textContent = `${records.length} records | ${fieldsCount} fields${filterNote}`;
};

const generateData = () => {
  if (!countInput || !filterInput || !result || !meta) return;

  const count = parseCount(countInput.value);
  const filterRaw = filterInput.value.trim();

  if (selectedFields.length === 0) {
    result.textContent = "[]";
    meta.textContent = "0 records (add at least one field)";
    return;
  }

  const { records, capped } = buildRecords(selectedFields, count, filterRaw);
  renderOutput(records, selectedFields.length, filterRaw, capped);
};

const debounce = (fn, ms) => {
  let t = null;
  return (...args) => {
    if (t !== null) clearTimeout(t);
    t = setTimeout(() => {
      t = null;
      fn(...args);
    }, ms);
  };
};

const debouncedGenerate = debounce(generateData, 150);

const renderSelectedFields = () => {
  if (!selectedFieldsContainer) return;
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
  if (!fieldSourceSelect) return;
  fieldSourceSelect.textContent = "";

  for (const field of availableFields) {
    const option = document.createElement("option");
    option.value = field.field;
    option.textContent = `${field.field} (${field.module})`;
    fieldSourceSelect.append(option);
  }
};

const renderAvailableFields = () => {
  if (!availableFieldsContainer) return;
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
  if (!meta) return;
  try {
    const response = await fetch("/api/fields");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
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
  } catch (e) {
    console.error("loadFields failed:", e);
    meta.textContent = "Could not load field list. Check console and try Refresh.";
    if (availableFieldsContainer) {
      availableFieldsContainer.textContent = "";
      const err = document.createElement("p");
      err.className = "muted";
      err.textContent = "Failed to load /api/fields.";
      availableFieldsContainer.append(err);
    }
  }
};

if (generateButton) generateButton.addEventListener("click", generateData);

if (addFieldButton) {
  addFieldButton.addEventListener("click", () => {
    const source = fieldSourceSelect?.value ?? "";
    const alias = fieldAliasInput?.value || source;

    if (!source) return;

    addSelectedField(source, alias);
    if (fieldAliasInput) fieldAliasInput.value = "";
    generateData();
  });
}

if (refreshFieldsButton) {
  refreshFieldsButton.addEventListener("click", async () => {
    await loadFields();
  });
}

if (countInput) countInput.addEventListener("change", generateData);
if (filterInput) filterInput.addEventListener("input", debouncedGenerate);

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const text = result?.textContent ?? "[]";
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
      if (meta) meta.textContent = `${meta.textContent ?? ""} | Copy failed (clipboard permission?)`;
    }
  });
}

loadFields();

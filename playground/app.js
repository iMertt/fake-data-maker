import { firstName, lastName, username, email, creditCard, streetAddress, city, country, zipCode, phoneNumber, pastDate, futureDate, birthDate, uuid, nanoid, hexColor, rgbColor, colorName, companyName, department, jobTitle, word, sentence, paragraph, words as loremWordsFn, url, ipv4, macAddress, password, iban, amount, currency, bitcoinAddress, fullName, gender, age, prefix, bloodType, userAgent, boolean as randomBoolean, rowCounter as createRowCounter, percentage, latitude, longitude, animal, emoji, mimeType, fileExtension, language, timezone, semver, domain, hashtag, regex as regexSample, } from "../dist/index.js";
const rowCounterInstance = createRowCounter();
const generatorByField = {
    firstName,
    lastName,
    username,
    email,
    creditCard,
    streetAddress,
    city,
    country,
    zipCode,
    phoneNumber,
    pastDate,
    futureDate,
    birthDate,
    uuid,
    nanoid,
    hexColor,
    rgbColor,
    colorName,
    companyName,
    department,
    jobTitle,
    word,
    sentence,
    paragraph,
    words: () => loremWordsFn(5),
    url,
    ipv4,
    macAddress,
    password,
    iban,
    amount,
    currency,
    bitcoinAddress,
    fullName,
    gender,
    age: () => String(age()),
    prefix,
    bloodType,
    userAgent,
    boolean: () => String(randomBoolean()),
    rowCounter: () => String(rowCounterInstance()),
    percentage: () => String(percentage()),
    latitude: () => String(latitude()),
    longitude: () => String(longitude()),
    animal,
    emoji,
    mimeType,
    fileExtension,
    language,
    timezone,
    semver,
    domain,
    hashtag,
    regex: () => regexSample("\\d{4}")(),
};
const isGeneratorKey = (key) => key in generatorByField;
/** Maps API module folder name to CSS variant suffix (mod-badge--*, selected-item--*). */
const MODULE_VARIANT = {
    person: "person",
    internet: "internet",
    finance: "finance",
    location: "location",
    phone: "phone",
    date: "date",
    id: "id",
    color: "color",
    company: "company",
    lorem: "lorem",
    misc: "lorem",
    schema: "id",
    src: "lorem",
    random: "lorem",
};
const PRESETS = [
    {
        name: "User list",
        fields: [
            ["id", "uuid"],
            ["firstName", "firstName"],
            ["lastName", "lastName"],
            ["email", "email"],
            ["username", "username"],
            ["createdAt", "pastDate"],
        ],
    },
    {
        name: "E-commerce order",
        fields: [
            ["orderId", "uuid"],
            ["product", "word"],
            ["price", "amount"],
            ["currency", "currency"],
            ["customer", "fullName"],
            ["orderDate", "pastDate"],
            ["status", "fromList-pending-shipped-delivered"],
        ],
    },
    {
        name: "Employee",
        fields: [
            ["id", "uuid"],
            ["name", "fullName"],
            ["email", "email"],
            ["department", "department"],
            ["title", "jobTitle"],
            ["phone", "phoneNumber"],
            ["hireDate", "pastDate"],
        ],
    },
    {
        name: "Address book",
        fields: [
            ["name", "fullName"],
            ["phone", "phoneNumber"],
            ["email", "email"],
            ["street", "streetAddress"],
            ["city", "city"],
            ["country", "country"],
            ["zip", "zipCode"],
        ],
    },
    {
        name: "Payment",
        fields: [
            ["txId", "uuid"],
            ["amount", "amount"],
            ["currency", "currency"],
            ["card", "creditCard"],
            ["iban", "iban"],
            ["date", "pastDate"],
        ],
    },
    {
        name: "Device/Network",
        fields: [
            ["ip", "ipv4"],
            ["mac", "macAddress"],
            ["userAgent", "userAgent"],
            ["browser", "word"],
            ["timezone", "timezone"],
            ["language", "language"],
        ],
    },
];
const countInput = document.getElementById("count");
const filterInput = document.getElementById("filter");
const resultCode = document.getElementById("result");
const meta = document.getElementById("meta");
const generateButton = document.getElementById("generate");
const copyButton = document.getElementById("copy");
const downloadBtn = document.getElementById("downloadCsv");
const addFieldButton = document.getElementById("addField");
const refreshFieldsButton = document.getElementById("refreshFields");
const fieldAliasInput = document.getElementById("fieldAlias");
const fieldSourceSelect = document.getElementById("fieldSource");
const availableFieldsContainer = document.getElementById("availableFields");
const selectedFieldsContainer = document.getElementById("selectedFields");
const outputPre = document.querySelector("pre.output-pre");
const scanPathInput = document.getElementById("scanPath");
const scanBtn = document.getElementById("scanBtn");
const scanStatus = document.getElementById("scanStatus");
const fieldsHint = document.getElementById("fieldsHint");
const formatTabs = document.getElementById("formatTabs");
const presetsGrid = document.getElementById("presetsGrid");
const presetsToggle = document.getElementById("presetsToggle");
const deriveToggle = document.getElementById("deriveToggle");
const deriveSection = document.getElementById("deriveSection");
const deriveInput = document.getElementById("deriveInput");
const detectBtn = document.getElementById("detectBtn");
const deriveStatus = document.getElementById("deriveStatus");
const saveSchemaBtn = document.getElementById("saveSchema");
const loadSchemaBtn = document.getElementById("loadSchema");
const loadSchemaFile = document.getElementById("loadSchemaFile");
const shareBtn = document.getElementById("shareBtn");
const fieldSearch = document.getElementById("fieldSearch");
const fieldsCollapse = document.getElementById("fieldsCollapse");
const fieldsBody = document.getElementById("fieldsBody");
const required = [
    countInput,
    filterInput,
    resultCode,
    meta,
    generateButton,
    copyButton,
    downloadBtn,
    addFieldButton,
    refreshFieldsButton,
    fieldAliasInput,
    fieldSourceSelect,
    availableFieldsContainer,
    selectedFieldsContainer,
];
if (required.some((el) => !el)) {
    console.error("nanofake playground: missing required DOM elements.");
}
let availableFields = [];
let selectedFields = [];
let lastOutputRaw = "[]";
let currentFormat = "json";
let currentRecords = [];
let lastFilterRaw = "";
let lastCapped = false;
const MAX_FILTER_ATTEMPTS = 50000;
const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const normalizeAlias = (alias) => {
    const clean = alias.trim().replace(/[^a-zA-Z0-9_]/g, "_");
    const base = clean.length > 0 ? clean : "field";
    return DANGEROUS_KEYS.has(base) ? `_${base}` : base;
};
const highlightJson = (s) => {
    const esc = s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    return esc
        .replace(/&quot;([^&]+)&quot;(?=\s*:)/g, '<span style="color:#85b7eb">&quot;$1&quot;</span>')
        .replace(/:\s*&quot;([^&]*)&quot;/g, ': <span style="color:#97c459">&quot;$1&quot;</span>')
        .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#ef9f27">$1</span>')
        .replace(/:\s*(true|false|null)/g, ': <span style="color:#d4537e">$1</span>');
};
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const formatOutput = (records, format) => {
    if (format === "json")
        return JSON.stringify(records, null, 2);
    if (format === "csv") {
        if (records.length === 0)
            return "";
        const keys = Object.keys(records[0]);
        const escape = (v) => {
            const s = v === null ? "" : String(v);
            return s.includes(",") || s.includes('"') || s.includes("\n")
                ? `"${s.replace(/"/g, '""')}"`
                : s;
        };
        return [keys.join(","), ...records.map((r) => keys.map((k) => escape(r[k])).join(","))].join("\n");
    }
    if (format === "sql") {
        if (records.length === 0)
            return "-- no records";
        const table = "nanofake_data";
        const keys = Object.keys(records[0]);
        const cols = keys.map((k) => `\`${k}\``).join(", ");
        const sqlVal = (v) => v === null ? "NULL" : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
        const rows = records.map((r) => `(${keys.map((k) => sqlVal(r[k])).join(", ")})`).join(",\n  ");
        return `INSERT INTO \`${table}\` (${cols})\nVALUES\n  ${rows};`;
    }
    return "";
};
const pickFromList = (choices) => choices[Math.floor(Math.random() * choices.length)];
const resolveValue = (field) => {
    if (field.source.startsWith("fromList-")) {
        const choices = field.source.split("-").slice(1);
        if (choices.length === 0)
            return "";
        return pickFromList(choices);
    }
    if (!isGeneratorKey(field.source))
        return null;
    const generate = generatorByField[field.source];
    return String(generate());
};
const makeRecord = (fields) => {
    const record = {};
    for (const field of fields) {
        if (Math.random() < field.nullPct / 100) {
            record[field.alias] = null;
            continue;
        }
        const val = resolveValue(field);
        if (val !== null) {
            record[field.alias] = val;
        }
        else {
            console.warn(`nanofake playground: no generator for source "${field.source}"`);
        }
    }
    return record;
};
const matchesFilter = (record, rawFilter) => {
    if (!rawFilter)
        return true;
    const filter = rawFilter.toLowerCase();
    return Object.values(record).some((value) => String(value ?? "").toLowerCase().includes(filter));
};
const parseCount = (raw) => Math.min(2000, Math.max(1, Number(raw) || 1));
const buildRecords = (fields, count, filterRaw) => {
    if (fields.length === 0) {
        return { records: [], capped: false };
    }
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
        if (matchesFilter(record, filterRaw))
            filtered.push(record);
        attempts += 1;
    }
    return { records: filtered, capped: filtered.length < count };
};
const renderOutput = (records, fieldsCount, filterRaw, capped) => {
    if (!resultCode || !meta)
        return;
    lastFilterRaw = filterRaw;
    lastCapped = capped;
    currentRecords = records;
    lastOutputRaw = formatOutput(records, currentFormat);
    if (currentFormat === "json") {
        resultCode.innerHTML = highlightJson(lastOutputRaw);
    }
    else {
        resultCode.innerHTML = escapeHtml(lastOutputRaw);
    }
    const filterNote = filterRaw && capped ? " (filter cap reached)" : "";
    meta.textContent = `${records.length} records | ${fieldsCount} fields${filterNote}`;
    if (outputPre instanceof HTMLElement) {
        outputPre.classList.remove("flash");
        void outputPre.offsetWidth;
        outputPre.classList.add("flash");
    }
    updateCopyDownloadLabels();
};
const updateCopyDownloadLabels = () => {
    const fmt = currentFormat.toUpperCase();
    if (copyButton)
        copyButton.textContent = `Copy ${fmt}`;
    if (downloadBtn)
        downloadBtn.textContent = `Download ${fmt}`;
};
const generateData = () => {
    if (!countInput || !filterInput || !resultCode || !meta)
        return;
    const count = parseCount(countInput.value);
    const filterRaw = filterInput.value.trim();
    if (selectedFields.length === 0) {
        currentRecords = [];
        lastOutputRaw = "[]";
        resultCode.innerHTML = highlightJson(lastOutputRaw);
        meta.textContent = "0 records (add at least one field)";
        return;
    }
    const { records, capped } = buildRecords(selectedFields, count, filterRaw);
    renderOutput(records, selectedFields.length, filterRaw, capped);
};
const debounce = (fn, ms) => {
    let t = null;
    return (...args) => {
        if (t !== null)
            clearTimeout(t);
        t = setTimeout(() => {
            t = null;
            fn(...args);
        }, ms);
    };
};
const debouncedGenerate = debounce(generateData, 150);
const canGenerate = (fieldName) => fieldName.startsWith("fromList-") || isGeneratorKey(fieldName);
const renderSelectedFields = () => {
    if (!selectedFieldsContainer)
        return;
    selectedFieldsContainer.textContent = "";
    if (selectedFields.length === 0) {
        const empty = document.createElement("li");
        empty.className = "selected-empty";
        empty.textContent = "No fields selected — add from above.";
        selectedFieldsContainer.append(empty);
        return;
    }
    for (const field of selectedFields) {
        const v = MODULE_VARIANT[field.module] ?? "lorem";
        const item = document.createElement("li");
        item.className = `selected-item selected-item--${v}`;
        const left = document.createElement("span");
        left.className = "stag-left";
        const text = document.createElement("span");
        text.className = "tag-text";
        const strong = document.createElement("strong");
        strong.textContent = field.alias;
        const sourceText = document.createTextNode(` ← ${field.source}`);
        text.append(strong, sourceText);
        left.append(text);
        const nullWrap = document.createElement("span");
        nullWrap.className = "null-wrap";
        const nullInput = document.createElement("input");
        nullInput.type = "number";
        nullInput.min = "0";
        nullInput.max = "100";
        nullInput.step = "5";
        nullInput.value = String(field.nullPct);
        nullInput.title = "Probability this field is null";
        nullInput.className = "null-inp";
        nullInput.addEventListener("change", () => {
            const next = Math.min(100, Math.max(0, Number(nullInput.value) || 0));
            field.nullPct = next;
            nullInput.value = String(next);
            generateData();
        });
        const pctLabel = document.createElement("span");
        pctLabel.className = "null-pct-label";
        pctLabel.textContent = "%";
        nullWrap.append(nullInput, pctLabel);
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "rm-btn";
        removeButton.setAttribute("aria-label", "Remove");
        removeButton.textContent = "×";
        removeButton.addEventListener("click", () => {
            selectedFields = selectedFields.filter((candidate) => candidate.id !== field.id);
            renderSelectedFields();
            generateData();
        });
        item.append(left, nullWrap, removeButton);
        selectedFieldsContainer.append(item);
    }
};
const addSelectedField = (source, alias = source, moduleName) => {
    if (!canGenerate(source))
        return;
    const normalized = normalizeAlias(alias);
    const id = `${normalized}_${source}_${Date.now()}_${crypto.randomUUID()}`;
    const module = moduleName ?? availableFields.find((f) => f.field === source)?.module ?? "person";
    selectedFields.push({ id, source, alias: normalized, module, nullPct: 0 });
    renderSelectedFields();
};
const renderFieldSourceOptions = () => {
    if (!fieldSourceSelect)
        return;
    fieldSourceSelect.textContent = "";
    for (const field of availableFields) {
        const option = document.createElement("option");
        option.value = field.field;
        option.textContent = `${field.field} (${field.module})`;
        fieldSourceSelect.append(option);
    }
};
const applyFieldSearchFilter = () => {
    if (!fieldSearch)
        return;
    const q = fieldSearch.value.toLowerCase();
    document.querySelectorAll(".field-pill").forEach((pill) => {
        const name = pill.querySelector(".fn")?.textContent?.toLowerCase() ?? "";
        const mod = pill.querySelector(".mod-badge")?.textContent?.toLowerCase() ?? "";
        pill.style.display = name.includes(q) || mod.includes(q) ? "" : "none";
    });
};
const renderAvailableFields = () => {
    if (!availableFieldsContainer)
        return;
    availableFieldsContainer.textContent = "";
    if (availableFields.length === 0) {
        const empty = document.createElement("p");
        empty.className = "hint";
        empty.textContent = "No exported generator fields found.";
        availableFieldsContainer.append(empty);
        return;
    }
    for (const field of availableFields) {
        const pill = document.createElement("div");
        pill.className = "field-pill";
        const v = MODULE_VARIANT[field.module] ?? "lorem";
        const badge = document.createElement("span");
        badge.className = `mod-badge mod-badge--${v}`;
        badge.textContent = field.module;
        const name = document.createElement("span");
        name.className = "field-name fn";
        name.textContent = field.field;
        name.title = field.field;
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "pill-add";
        addButton.textContent = "+";
        addButton.addEventListener("click", () => {
            if (canGenerate(field.field)) {
                addSelectedField(field.field, field.field, field.module);
                generateData();
            }
        });
        pill.append(badge, name, addButton);
        availableFieldsContainer.append(pill);
    }
    applyFieldSearchFilter();
};
const setScanStatus = (message, kind) => {
    if (!scanStatus)
        return;
    scanStatus.textContent = message;
    scanStatus.classList.remove("error", "success");
    if (kind === "error")
        scanStatus.classList.add("error");
    if (kind === "success")
        scanStatus.classList.add("success");
};
const loadFields = async (path = "src", bust = false) => {
    if (!meta)
        return;
    const resolvedPath = path.trim() || "src";
    try {
        const url = bust
            ? `/api/fields?scanPath=${encodeURIComponent(resolvedPath)}&bust=1`
            : `/api/fields?scanPath=${encodeURIComponent(resolvedPath)}`;
        const response = await fetch(url);
        if (response.status === 400) {
            setScanStatus("Invalid path", "error");
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = (await response.json());
        availableFields = (data.fields ?? []).filter((field) => canGenerate(field.field));
        renderFieldSourceOptions();
        renderAvailableFields();
        const displayPath = data.scanPath ?? resolvedPath;
        const fileCount = data.scannedFiles?.length ?? 0;
        const fnCount = (data.fields ?? []).length;
        if (scanPathInput)
            scanPathInput.value = String(displayPath);
        if (scanStatus) {
            scanStatus.textContent = `✓ ${fileCount} file(s) scanned in ${displayPath} — ${fnCount} functions found`;
            scanStatus.classList.remove("error");
            scanStatus.classList.add("success");
        }
        if (fieldsHint) {
            fieldsHint.textContent = `Scanned from exported functions under ${displayPath}`;
        }
        if (selectedFields.length === 0) {
            for (const field of ["firstName", "lastName", "username", "email"]) {
                const found = availableFields.find((candidate) => candidate.field === field);
                if (canGenerate(field) && found) {
                    addSelectedField(field, field, found.module);
                }
            }
        }
        renderSelectedFields();
        generateData();
    }
    catch (e) {
        console.error("loadFields failed:", e);
        if (scanStatus) {
            scanStatus.textContent = "";
            scanStatus.classList.remove("error", "success");
        }
        meta.textContent = "Could not load field list. Check console and try Refresh.";
        if (availableFieldsContainer) {
            availableFieldsContainer.textContent = "";
            const err = document.createElement("p");
            err.className = "hint";
            err.textContent = "Failed to load /api/fields.";
            availableFieldsContainer.append(err);
        }
    }
};
const renderPresets = () => {
    if (!presetsGrid)
        return;
    presetsGrid.textContent = "";
    for (const preset of PRESETS) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "preset-btn";
        btn.textContent = preset.name;
        btn.addEventListener("click", () => {
            selectedFields = [];
            for (const [alias, source] of preset.fields) {
                if (!canGenerate(source))
                    continue;
                const normalized = normalizeAlias(alias);
                const id = `${normalized}_${source}_${Date.now()}_${crypto.randomUUID()}`;
                const mod = availableFields.find((f) => f.field === source)?.module ?? "misc";
                selectedFields.push({ id, source, alias: normalized, module: mod, nullPct: 0 });
            }
            renderSelectedFields();
            generateData();
            presetsGrid.classList.add("hidden");
            if (presetsToggle)
                presetsToggle.textContent = "Show";
        });
        presetsGrid.append(btn);
    }
};
const inferSource = (key, value) => {
    const k = key.toLowerCase();
    if (typeof value === "boolean")
        return "boolean";
    if (typeof value === "number") {
        if (/id/i.test(key) && !/uuid/i.test(key))
            return "rowCounter";
        if (value >= 0 && value <= 100)
            return "percentage";
        return "amount";
    }
    if (typeof value === "string") {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return "email";
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))
            return "uuid";
        if (/^\d{4}-\d{2}-\d{2}$/.test(value))
            return "pastDate";
        if (/^\+?[\d\s().-]{7,}$/.test(value))
            return "phoneNumber";
        if (/^https?:\/\//i.test(value))
            return "url";
        if (/^#[0-9a-f]{3,8}$/i.test(value))
            return "hexColor";
    }
    if (k.includes("name") && k.includes("first"))
        return "firstName";
    if (k.includes("name") && k.includes("last"))
        return "lastName";
    if (k === "name" || k.includes("fullname"))
        return "fullName";
    if (k.includes("company"))
        return "companyName";
    if (k.includes("city"))
        return "city";
    if (k.includes("country"))
        return "country";
    if (k.includes("address"))
        return "streetAddress";
    if (k.includes("zip") || k.includes("postal"))
        return "zipCode";
    if (k.includes("age"))
        return "age";
    if (k.includes("gender"))
        return "gender";
    if (k.includes("phone"))
        return "phoneNumber";
    if (k.includes("username") || k.includes("user_name"))
        return "username";
    if (k.includes("password"))
        return "password";
    if (k.includes("card") || k.includes("credit"))
        return "creditCard";
    if (k.includes("iban"))
        return "iban";
    if (k.includes("lat"))
        return "latitude";
    if (k.includes("lon") || k.includes("lng"))
        return "longitude";
    if (k.includes("color") || k.includes("colour"))
        return "hexColor";
    if (k.includes("ip"))
        return "ipv4";
    if (k.includes("url") || k.includes("website") || k.includes("site"))
        return "url";
    return "word";
};
const deriveSchema = (json) => {
    if (!deriveStatus)
        return;
    deriveStatus.textContent = "";
    let parsed;
    try {
        parsed = JSON.parse(json);
    }
    catch {
        deriveStatus.textContent = "Invalid JSON";
        return;
    }
    let obj;
    if (Array.isArray(parsed)) {
        if (parsed.length === 0 || typeof parsed[0] !== "object" || parsed[0] === null) {
            deriveStatus.textContent = "Invalid JSON";
            return;
        }
        obj = parsed[0];
    }
    else if (typeof parsed === "object" && parsed !== null) {
        obj = parsed;
    }
    else {
        deriveStatus.textContent = "Invalid JSON";
        return;
    }
    selectedFields = [];
    let count = 0;
    for (const key of Object.keys(obj)) {
        const src = inferSource(key, obj[key]);
        if (canGenerate(src)) {
            addSelectedField(src, key, "misc");
            count += 1;
        }
    }
    deriveStatus.textContent = `Detected ${count} fields from example`;
    if (deriveInput)
        deriveInput.value = "";
    generateData();
};
const applyLoadedSchema = (data) => {
    if (!Array.isArray(data.fields))
        return false;
    selectedFields = [];
    for (const f of data.fields) {
        if (typeof f.alias !== "string" || typeof f.source !== "string")
            return false;
        const nullPct = typeof f.nullPct === "number" ? f.nullPct : 0;
        if (!canGenerate(f.source))
            continue;
        const id = `${f.alias}_${f.source}_${Date.now()}_${crypto.randomUUID()}`;
        selectedFields.push({
            id,
            source: f.source,
            alias: normalizeAlias(f.alias),
            module: availableFields.find((a) => a.field === f.source)?.module ?? "misc",
            nullPct: Math.min(100, Math.max(0, nullPct)),
        });
    }
    if (countInput && typeof data.count === "number")
        countInput.value = String(data.count);
    if (typeof data.format === "string" && ["json", "csv", "sql"].includes(data.format)) {
        currentFormat = data.format;
        document.querySelectorAll(".fmt-tab").forEach((el) => {
            el.classList.toggle("active", el.dataset.fmt === currentFormat);
        });
    }
    renderSelectedFields();
    generateData();
    updateCopyDownloadLabels();
    return true;
};
const restoreSchemaFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("schema");
    if (!raw)
        return;
    try {
        const json = decodeURIComponent(escape(atob(raw)));
        const data = JSON.parse(json);
        if (applyLoadedSchema(data)) {
            params.delete("schema");
            const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}${window.location.hash}`;
            history.replaceState(null, "", next);
        }
    }
    catch {
        // ignore
    }
};
if (generateButton)
    generateButton.addEventListener("click", generateData);
if (addFieldButton) {
    addFieldButton.addEventListener("click", () => {
        const source = fieldSourceSelect?.value ?? "";
        const alias = fieldAliasInput?.value || source;
        if (!source || !canGenerate(source))
            return;
        const mod = availableFields.find((f) => f.field === source)?.module ?? "person";
        addSelectedField(source, alias, mod);
        if (fieldAliasInput)
            fieldAliasInput.value = "";
        generateData();
    });
}
if (refreshFieldsButton) {
    refreshFieldsButton.addEventListener("click", async () => {
        if (scanPathInput)
            scanPathInput.value = "src";
        await loadFields("src", true);
    });
}
if (scanBtn) {
    scanBtn.addEventListener("click", async () => {
        if (!scanPathInput)
            return;
        const p = scanPathInput.value.trim() || "src";
        await loadFields(p, true);
    });
}
if (countInput)
    countInput.addEventListener("input", generateData);
if (filterInput)
    filterInput.addEventListener("input", debouncedGenerate);
if (copyButton) {
    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(lastOutputRaw);
        }
        catch (e) {
            console.error("Clipboard copy failed:", e);
            if (meta)
                meta.textContent = `${meta.textContent ?? ""} | Copy failed (clipboard permission?)`;
        }
    });
}
if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        const ext = currentFormat === "json" ? "json" : currentFormat === "csv" ? "csv" : "sql";
        const mime = currentFormat === "json"
            ? "application/json"
            : currentFormat === "csv"
                ? "text/csv"
                : "text/plain";
        const blob = new Blob([lastOutputRaw], { type: `${mime};charset=utf-8` });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `nanofake-data.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
    });
}
if (formatTabs) {
    formatTabs.addEventListener("click", (e) => {
        const t = e.target.closest(".fmt-tab");
        if (!t || !t.dataset.fmt)
            return;
        const fmt = t.dataset.fmt;
        currentFormat = fmt;
        document.querySelectorAll(".fmt-tab").forEach((el) => {
            el.classList.toggle("active", el === t);
        });
        updateCopyDownloadLabels();
        renderOutput(currentRecords, selectedFields.length, lastFilterRaw, lastCapped);
    });
}
if (presetsToggle && presetsGrid) {
    presetsToggle.addEventListener("click", () => {
        const hidden = presetsGrid.classList.toggle("hidden");
        presetsToggle.textContent = hidden ? "Show" : "Hide";
    });
}
if (fieldSearch) {
    fieldSearch.addEventListener("input", () => {
        applyFieldSearchFilter();
    });
}
if (fieldsCollapse && fieldsBody) {
    fieldsCollapse.addEventListener("click", () => {
        const collapsed = fieldsBody.classList.toggle("collapsed");
        fieldsCollapse.setAttribute("aria-expanded", collapsed ? "false" : "true");
        fieldsCollapse.textContent = collapsed ? "▸" : "▾";
    });
}
if (deriveToggle && deriveSection) {
    deriveToggle.addEventListener("click", () => {
        deriveSection.classList.toggle("hidden");
    });
}
if (detectBtn) {
    detectBtn.addEventListener("click", () => {
        if (deriveInput)
            deriveSchema(deriveInput.value);
    });
}
if (saveSchemaBtn) {
    saveSchemaBtn.addEventListener("click", () => {
        const payload = {
            fields: selectedFields.map((f) => ({
                alias: f.alias,
                source: f.source,
                nullPct: f.nullPct,
            })),
            count: parseCount(countInput?.value ?? "1"),
            format: currentFormat,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "nanofake-schema.json";
        a.click();
        URL.revokeObjectURL(a.href);
    });
}
if (loadSchemaBtn && loadSchemaFile) {
    loadSchemaBtn.addEventListener("click", () => {
        loadSchemaFile.click();
    });
    loadSchemaFile.addEventListener("change", () => {
        const file = loadSchemaFile.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(String(reader.result));
                if (!applyLoadedSchema(data))
                    throw new Error("bad shape");
            }
            catch {
                alert("Invalid schema file");
            }
            loadSchemaFile.value = "";
        };
        reader.readAsText(file);
    });
}
if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
        const payload = {
            fields: selectedFields.map((f) => ({
                alias: f.alias,
                source: f.source,
                nullPct: f.nullPct,
            })),
            count: parseCount(countInput?.value ?? "1"),
            format: currentFormat,
        };
        const raw = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
        const url = new URL(window.location.href);
        url.searchParams.set("schema", raw);
        history.pushState(null, "", url.toString());
        try {
            await navigator.clipboard.writeText(url.toString());
            const prev = shareBtn.textContent;
            shareBtn.textContent = "Link copied!";
            setTimeout(() => {
                shareBtn.textContent = prev ?? "Share";
            }, 2000);
        }
        catch {
            shareBtn.textContent = "Share";
        }
    });
}
void loadFields("src").then(() => {
    renderPresets();
    updateCopyDownloadLabels();
    restoreSchemaFromUrl();
});

export const formatDate = (value, options = {}) => {
    if (!value) return "-";
    const date = new Date(`${value}T12:00:00`);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        ...options,
    }).format(date);
};

export const formatCurrency = (value, compact = false) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
}).format(Number(value) || 0);

export const formatPeriod = (value) => {
    if (!value) return "Current period";
    const [year, month] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" })
        .format(new Date(year, month - 1, 1));
};

export const countWorkingDays = (start, end) => {
    if (!start || !end || start > end) return 0;
    const date = new Date(`${start}T12:00:00`);
    const last = new Date(`${end}T12:00:00`);
    let days = 0;
    while (date <= last) {
        const weekday = date.getDay();
        if (weekday !== 0 && weekday !== 6) days += 1;
        date.setDate(date.getDate() + 1);
    }
    return days;
};

export const downloadCsv = (filename, rows) => {
    if (!rows.length) return false;
    const headers = Object.keys(rows[0]);
    const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const content = [headers.map(quote).join(","), ...rows.map((row) => headers.map((header) => quote(row[header])).join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" });
    const address = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = address;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(address);
    return true;
};

export const getInitials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

export const slugify = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

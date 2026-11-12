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
    const firstDate = new Date(`${start}T12:00:00`);
    const lastDate = new Date(`${end}T12:00:00`);
    if (Number.isNaN(firstDate.getTime()) || Number.isNaN(lastDate.getTime())) return 0;

    const toUtcDay = (date) => {
        const utcDate = new Date(0);
        utcDate.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        utcDate.setUTCHours(0, 0, 0, 0);
        return utcDate.getTime();
    };
    const firstDay = toUtcDay(firstDate);
    const lastDay = toUtcDay(lastDate);
    const totalDays = Math.floor((lastDay - firstDay) / 86_400_000) + 1;
    const fullWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    let workingDays = fullWeeks * 5;

    for (let offset = 0; offset < remainingDays; offset += 1) {
        const weekday = (firstDate.getDay() + offset) % 7;
        if (weekday !== 0 && weekday !== 6) workingDays += 1;
    }
    return workingDays;
};

export const downloadCsv = (filename, rows) => {
    if (!rows.length) return false;
    const headers = Object.keys(rows[0]);
    const quote = (value) => {
        const text = String(value ?? "");
        const startsWithFormula = /^\s*[=+\-@]/.test(text);
        const startsWithControl = text.length > 0 && text.charCodeAt(0) <= 0x1f;
        const safeText = startsWithFormula || startsWithControl
            ? `'${text}`
            : text;
        return `"${safeText.replaceAll('"', '""')}"`;
    };
    const content = [headers.map(quote).join(","), ...rows.map((row) => headers.map((header) => quote(row[header])).join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" });
    const address = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = address;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(address), 1000);
    return true;
};

export const getInitials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

export const slugify = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

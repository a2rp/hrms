const dateOffset = (days) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
};

export const todayKey = () => dateOffset(0);

export const departments = ["People", "Product", "Engineering", "Finance", "Revenue"];

export const employees = [
    { id: "EMP-104", name: "Olivia Chen", role: "Head of People", department: "People", location: "San Francisco", email: "olivia.chen@morrow.example", phone: "+1 (415) 555-0142", manager: "Board of Directors", employmentType: "Full time", status: "Active", startDate: dateOffset(-1825), birthday: "1991-03-18", salary: 164000, leave: { annual: 17, sick: 8, personal: 3 }, initials: "OC", color: "lilac" },
    { id: "EMP-105", name: "Amara Okafor", role: "People Partner", department: "People", location: "London", email: "amara.okafor@morrow.example", phone: "+44 20 7946 0145", manager: "Olivia Chen", employmentType: "Full time", status: "Active", startDate: dateOffset(-810), birthday: "1993-11-06", salary: 92000, leave: { annual: 15, sick: 7, personal: 2 }, initials: "AO", color: "rose" },
    { id: "EMP-106", name: "Maya Patel", role: "Product Designer", department: "Product", location: "New York", email: "maya.patel@morrow.example", phone: "+1 (212) 555-0171", manager: "Jonah Miles", employmentType: "Full time", status: "Active", startDate: dateOffset(-490), birthday: "1995-07-22", salary: 118000, leave: { annual: 12, sick: 8, personal: 3 }, initials: "MP", color: "gold" },
    { id: "EMP-107", name: "Jonah Miles", role: "Engineering Lead", department: "Engineering", location: "Austin", email: "jonah.miles@morrow.example", phone: "+1 (512) 555-0184", manager: "Olivia Chen", employmentType: "Full time", status: "Active", startDate: dateOffset(-1160), birthday: "1989-09-14", salary: 152000, leave: { annual: 16, sick: 8, personal: 3 }, initials: "JM", color: "blue" },
    { id: "EMP-108", name: "Tessa Yang", role: "Data Analyst", department: "Engineering", location: "Toronto", email: "tessa.yang@morrow.example", phone: "+1 (416) 555-0119", manager: "Jonah Miles", employmentType: "Full time", status: "Active", startDate: dateOffset(-350), birthday: "1997-02-03", salary: 103000, leave: { annual: 10, sick: 7, personal: 2 }, initials: "TY", color: "mint" },
    { id: "EMP-109", name: "Mateo Ruiz", role: "Finance Manager", department: "Finance", location: "San Francisco", email: "mateo.ruiz@morrow.example", phone: "+1 (415) 555-0161", manager: "Olivia Chen", employmentType: "Full time", status: "Active", startDate: dateOffset(-700), birthday: "1990-05-27", salary: 136000, leave: { annual: 14, sick: 8, personal: 3 }, initials: "MR", color: "peach" },
    { id: "EMP-110", name: "Zara Ahmed", role: "Revenue Operations Lead", department: "Revenue", location: "Chicago", email: "zara.ahmed@morrow.example", phone: "+1 (312) 555-0193", manager: "Olivia Chen", employmentType: "Full time", status: "Probation", startDate: dateOffset(-63), birthday: "1994-12-09", salary: 125000, leave: { annual: 18, sick: 8, personal: 3 }, initials: "ZA", color: "plum" },
    { id: "EMP-111", name: "Noah Kim", role: "Customer Experience Manager", department: "Revenue", location: "Seattle", email: "noah.kim@morrow.example", phone: "+1 (206) 555-0127", manager: "Zara Ahmed", employmentType: "Contract", status: "Active", startDate: dateOffset(-280), birthday: "1992-08-11", salary: 98000, leave: { annual: 9, sick: 5, personal: 1 }, initials: "NK", color: "teal" },
    { id: "EMP-112", name: "Lena Ortiz", role: "People Coordinator", department: "People", location: "London", email: "lena.ortiz@morrow.example", phone: "+44 20 7946 0118", manager: "Amara Okafor", employmentType: "Full time", status: "Active", startDate: dateOffset(-135), birthday: "1998-04-02", salary: 72000, leave: { annual: 11, sick: 7, personal: 2 }, initials: "LO", color: "coral" },
];

export const attendance = employees.map((employee, index) => {
    const statuses = ["Present", "Present", "Remote", "Late", "Present", "Present", "Not started", "Remote", "Present"];
    const status = statuses[index];
    return {
        id: `ATT-${index + 301}`,
        employeeId: employee.id,
        date: todayKey(),
        status,
        clockIn: status === "Not started" ? "--:--" : status === "Late" ? "09:24" : index % 2 ? "09:02" : "08:51",
        clockOut: status === "Present" ? "17:30" : "--:--",
        note: status === "Remote" ? "Working from home" : "",
    };
});

export const leaveRequests = [
    { id: "LV-204", employeeId: "EMP-106", type: "Annual", startDate: dateOffset(6), endDate: dateOffset(9), days: 4, status: "Pending", reason: "Family trip", submitted: dateOffset(-2) },
    { id: "LV-203", employeeId: "EMP-105", type: "Personal", startDate: dateOffset(3), endDate: dateOffset(3), days: 1, status: "Pending", reason: "Personal appointment", submitted: dateOffset(-1) },
    { id: "LV-202", employeeId: "EMP-108", type: "Sick", startDate: dateOffset(-4), endDate: dateOffset(-3), days: 2, status: "Approved", reason: "Recovery", submitted: dateOffset(-5) },
    { id: "LV-201", employeeId: "EMP-110", type: "Annual", startDate: dateOffset(14), endDate: dateOffset(15), days: 2, status: "Declined", reason: "Travel", submitted: dateOffset(-8) },
    { id: "LV-200", employeeId: "EMP-109", type: "Annual", startDate: dateOffset(-15), endDate: dateOffset(-12), days: 4, status: "Approved", reason: "Time with family", submitted: dateOffset(-25) },
];

const monthKey = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const payroll = employees.map((employee, index) => ({
    employeeId: employee.id,
    period: monthKey(),
    status: index === 0 ? "Paid" : index === 6 ? "Review" : "Ready",
    bonus: index === 2 ? 850 : 0,
    deductions: Math.round(employee.salary * 0.22 / 12),
    paidDate: index === 0 ? dateOffset(-2) : "",
}));

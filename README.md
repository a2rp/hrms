![Morrow HR overview](./screenshot.png)

# Morrow HR

Morrow is a frontend-only human resources workspace for small teams. It brings employee records, attendance, time off, and payroll planning into one responsive interface.

**Live app:** [https://a2rp.github.io/hrms/](https://a2rp.github.io/hrms/)
**Repository:** [github.com/a2rp/hrms](https://github.com/a2rp/hrms)

## What you can do

- **Overview:** Review the team, attendance for today, leave waiting for review, and team composition. Jump to the people directory or review leave requests.
- **People:** Search, filter, sort, and export the current directory as CSV. Add employees with field validation, open employee profiles, edit details, and remove records with a confirmation dialog.
- **Attendance:** Find records by employee, date, or status. Change a person's attendance status, clock-in and clock-out times, and note. Export the current filtered view as CSV.
- **Time off:** See leave balances and submitted requests. Submit a request with date-range, working-day, available-balance, and overlap checks. Approve or decline pending requests with confirmation. Approved leave updates the employee's remaining balance.
- **Payroll:** Browse pay-period estimates, filter the list, and export the current view. Open an employee statement and mark a period as paid in the demo UI. No payment is sent or processed.
- **Shared session state:** Employee changes and leave decisions are reflected across the routes for as long as the page remains open. Toast notifications report completed actions and validation feedback.

Forms, filters, sorting, CSV exports, profile details, confirmations, and status changes are implemented in the interface. Destructive actions require a custom confirmation dialog. The layout adapts to smaller screens with a collapsible sidebar.

## Data and limits

The app uses fictional sample employees and React in-memory state. It does not call a backend and does not use browser storage. Changes reset when the page is refreshed. Example contact emails use the reserved `.example` domain.

Attendance, leave, and payroll values are demonstrations. Leave working-day calculations skip weekends but do not include a country-specific public-holiday calendar. Payroll amounts are estimates; marking a statement as paid only changes its demo status and does not transfer money.

## Screenshots

Screenshots below were captured from the running production build with representative sample data.

### Pages

| Page | Screenshot |
| --- | --- |
| Overview | ![Morrow HR overview page](./screenshots/pages/overview.png) |
| People directory | ![People directory with employee records and actions](./screenshots/pages/people.png) |
| Attendance | ![Attendance records and controls](./screenshots/pages/attendance.png) |
| Time off | ![Leave balances and request review](./screenshots/pages/leave.png) |
| Payroll | ![Payroll periods and employee estimates](./screenshots/pages/payroll.png) |
| Not found | ![Custom not found page](./screenshots/pages/not-found.png) |

### Dialogs and confirmations

Each screenshot shows a separate dialog state from the running app.

<details>
<summary>Employee dialogs</summary>

**Add employee**

![Add employee form](./screenshots/modals/new-person.png)

**Add employee validation**

![Employee form showing inline validation](./screenshots/modals/new-person-validation.png)

**Employee profile**

![Employee profile details](./screenshots/modals/employee-profile.png)

**Edit employee**

![Edit employee form](./screenshots/modals/employee-edit.png)

**Remove employee confirmation**

![Remove employee confirmation dialog](./screenshots/modals/remove-confirmation.png)

</details>

<details>
<summary>Attendance and time-off dialogs</summary>

**Edit attendance**

![Attendance editor dialog](./screenshots/modals/attendance-editor.png)

**Request time off**

![Time off request form](./screenshots/modals/leave-request.png)

**Approve time-off request confirmation**

![Time off approval confirmation](./screenshots/modals/leave-approval-confirmation.png)

</details>

<details>
<summary>Payroll dialogs</summary>

**Payroll statement**

![Employee payroll statement preview](./screenshots/modals/payslip-preview.png)

**Mark period paid confirmation**

![Confirm marking the payroll period paid](./screenshots/modals/payroll-paid-confirmation.png)

</details>

## Run locally

Use Node.js and npm, then run:

```sh
npm install
npm run dev
```

Vite prints the local address in the terminal. Because this app is configured for the `/hrms/` GitHub Pages path, open the local app at `http://localhost:5173/hrms/`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build, create the GitHub Pages SPA fallback, and publish `dist/` to the `gh-pages` branch |

The deploy command requires Git access to the repository and publishes the existing build to GitHub Pages. The repository is configured to serve at [https://a2rp.github.io/hrms/](https://a2rp.github.io/hrms/).

## Images and assets

The team photograph is stored locally at `public/images/team-collaboration.jpg`. It was downloaded from Unsplash, photo ID `photo-1521737711867-e3b97375f902`, so the app does not depend on a remote image request. The favicon, app logo, and social sharing preview are local public assets.

## Future improvements

These backend-dependent extensions are not implemented:

- Add organization accounts, role-based access, and shared server-side employee and HR data.
- Store attendance, leave, and payroll records in a database so authorized teammates can work from different devices.
- Connect leave and attendance workflows to calendar, timekeeping, and public-holiday services.
- Integrate a payroll provider for verified payroll calculations and payment processing.
- Add secure hosted document storage for employment records and payslips, with access controls and retention policies.
- Keep a server-side audit history for sensitive HR changes and approvals.

The current frontend workflows remain usable with demo data; these items describe shared services and integrations that require a backend or external provider.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)

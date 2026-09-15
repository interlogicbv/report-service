# Report Service

Internal service for scheduled forwarding performance reports and carrier document reminders.

## Reports

### Forwarding performance

All performance reports include:

- Shipments, revenue, costs, result and efficiency
- A goal progress bar
- Comparison with the previous equivalent period
- Incidents excluded from revenue, costs and result
- An Excel attachment with shipment details

Weekly and monthly reports use the trip start date (`BeginTripActivity`). The daily report uses the creation date and represents shipments sold on that day.

| Report | Flag | Default period | Goal | Additional content |
| --- | --- | --- | ---: | --- |
| Daily | `-fp` | Today | €7,500 | Comparison with previous day |
| Weekly | `-fwp` | Current Monday–Friday | €37,500 | Previous-week comparison and daily breakdown |
| Monthly | `-fmp` | Current month | €7,500 per weekday | Previous-month comparison and daily breakdown |

### Missing carrier documents

The `-cd` job finds shipments completed more than seven days ago without a received CMR, groups them by carrier email address and sends each carrier its missing-document list.

## Requirements

- Node.js
- npm
- Access to the Microsoft SQL Server database
- Access to the configured SMTP server

## Installation

```bash
git clone https://github.com/interlogicbv/report-service.git
cd report-service
npm install
npm run build
```

## Environment variables

Create a `.env` file in the project root:

```dotenv
# Database
DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_DATABASE=

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_DEFAULT_MAIL_TO=

# Forwarding performance
FORWARDING_PERFORMANCE_DAILY_GOAL=7500
FORWARDING_PERFORMANCE_MAIL_TO=

# Carrier documents: creditor names separated by semicolons
CARRIER_DOCUMENTS_EXCLUDED_CREDITORS=
```

`SMTP_DEFAULT_MAIL_TO` is only used when a job does not provide its own recipients. Multiple recipients can be separated with commas.

To exclude creditors from the missing-documents query, set their full creditor names (`CR.Name`) in `.env`:

```dotenv
CARRIER_DOCUMENTS_EXCLUDED_CREDITORS="Creditor A;Creditor B;Creditor C"
```

Names are separated by semicolons; surrounding spaces and empty entries are ignored. Matching uses full names, with case sensitivity determined by the database collation. An empty or absent setting excludes no creditors. This applies only to the carrier documents job (`-cd`), and excluded shipments are omitted from carrier reminder emails.

## Commands

Build after deploying code changes:

```bash
npm run build
```

Daily performance for today or a specific date:

```bash
npm start -- -fp
npm start -- -fp -date=2026-08-20
```

Weekly performance for the current week or the week containing a specific date:

```bash
npm start -- -fwp
npm start -- -fwp -date=2026-08-13
```

The weekly report always normalizes the supplied date to that week's Monday and selects Monday through Friday.

Monthly performance for the current month or a specific month:

```bash
npm start -- -fmp
npm start -- -fmp -date=2026-08
```

Missing carrier documents:

```bash
npm start -- -cd
```

Development mode:

```bash
npm run dev
```

## Scheduling examples

Example cron entries for Europe/Amsterdam server time:

```cron
# Daily performance on weekdays at 08:00
0 8 * * 1-5 /root/report-service/daily-performance.sh >> /var/log/report-service-daily.log 2>&1

# Previous week every Monday at 08:00
0 8 * * 1 /root/report-service/weekly-performance.sh >> /var/log/report-service-weekly.log 2>&1

# Previous month on the first day of each month at 08:00
0 8 1 * * /root/report-service/monthly-performance.sh >> /var/log/report-service-monthly.log 2>&1
```

Weekly script:

```bash
#!/bin/bash
set -euo pipefail
cd /root/report-service
PREVIOUS_WEEK_DATE="$(date --date="7 days ago" +"%Y-%m-%d")"
npm start -- -fwp -date="$PREVIOUS_WEEK_DATE"
```

Monthly script:

```bash
#!/bin/bash
set -euo pipefail
cd /root/report-service
PREVIOUS_MONTH="$(date --date="$(date +%Y-%m-01) -1 month" +"%Y-%m")"
npm start -- -fmp -date="$PREVIOUS_MONTH"
```

## Project structure

```text
src/
├── index.ts
├── excel/forwarding/performance.ts
├── queries/
│   ├── carrier/documents/helper.ts
│   └── forwarding/performance/helper.ts
├── services/
│   ├── carrier/documents.ts
│   └── forwarding/performance.ts
├── templates/
│   ├── carrier/documents.ts
│   └── forwarding/performance.ts
└── utils/
    ├── db.ts
    └── mail.ts
```

## License

MIT License

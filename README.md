# Report Service

The internal report service designed for efficient data analysis and reporting.

## Features

### Forwarding Reports

- **Forwarding Performance Report**
  - Daily report with shipments, revenue, costs, and efficiency
  - Including Excel-sheet with shipment details

- **Forwarding Overview Report**
  - Monthly overview
  - Including Excel-sheet with shipment details

### Carrier Reports

- **Missing Documents**
  - Automatically detects shipments without received CMR documents
  - Filters shipments older than 7 days
  - Groups shipments per transporter (email)
  - Sends one email per transporter with their shipments

## Installation

```bash
git clone https://github.com/interlogicbv/report-service.git
cd report-service
npm install
```

## Environment Variables

Create a `.env` file:

```
# Databse configuration
DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_DATABASE=

# SMTP configuration
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_DEFAULT_MAIL_TO=

# Forwarding performance report configuration
FORWARDING_PERFORMANCE_DAILY_GOAL=
FORWARDING_PERFORMANCE_MAIL_TO=

# Forwarding overview report configuration
FORWARDING_OVERVIEW_MAIL_TO=
```

## Usage

### Performance Report (daily)

```bash
npm start -- -fp
```

Custom date:

```bash
npm start -- -fp -date=2026-04-01
```

### Overview Report (monthly)

```bash
npm start -- -fo
```

Custom date:

```bash
npm start -- -fo -date=2026-04
```

### Missing Documents

```bash
npm start -- -cd
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Project Structure

```
src/
├── index.ts
├── excel/
│   └── forwarding/
├── queries/
│   ├── carrier/
│   └── forwarding/
├── services/
│   ├── carrier/
│   └── forwarding/
├── templates/
│   ├── carrier/
│   └── forwarding/
├── utils/
│   └── db.ts
│   └── mail.ts
```

## Dependencies

- `mssql`
- `nodemailer`
- `exceljs`
- `dotenv`
- `typescript`

## License

MIT License

## Author

R. van Rees

## Repository

https://github.com/interlogicbv/report-service

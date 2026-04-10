# Report Service

Internal report service from Interlogic B.V.
This service generates and sends automated reports and operational emails based on data from an MSSQL database.

---

## Features

### 📊 Forwarding Reports

- **Forwarding Performance Report**
  - Daily report with shipments, revenue, costs, and efficiency
  - Sent as HTML email

- **Forwarding Overview Report**
  - Monthly overview
  - Exported to Excel and sent as attachment

### 📦 Customer / Operational

- **Missing CMR Documents**
  - Automatically detects shipments without received CMR documents
  - Filters shipments older than 7 days
  - Groups shipments per transporter (email)
  - Sends one email per transporter with their shipments

- **Customer Performance Report**
  - Automatically inform the customer with the shipments we completed
  - Weekly overview
  - Exported to Excel and sent as attachment

---

## Installation

```bash
git clone https://github.com/interlogicbv/report-service.git
cd report-service
npm install
```

---

## Environment Variables

Create a `.env` file:

```
DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_DATABASE=

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

DEFAULT_MAIL=

FORWARDING_PERFORMANCE_MAIL_TO=
FORWARDING_PERFORMANCE_DAILY_GOAL=

FORWARDING_OVERVIEW_MAIL_TO=

CUSTOMER_SHIPMENTS_MAIL_TO=
```

---

## Usage

### 📊 Performance Report (daily)

```bash
npm start -- -fp
```

Custom date:

```bash
npm start -- -fp -date=2026-04-10
```

---

### 📈 Overview Report (monthly)

```bash
npm start -- -fo
```

Custom month:

```bash
npm start -- -fo -date=2026-04
```

---

### 📦 Missing CMR Documents

```bash
npm start -- -papers
```

### 📈 Overview Report (weekly)

```bash
npm start -- -cp
```

Custom month:

```bash
npm start -- -cp -date=2026-14
```

---

## Development

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

## Production

```bash
npm start
```

---

## Project Structure

```
src/
├── db.ts
├── mail.ts
├── index.ts

├── queries/
│   ├── forwarding/
│   └── customers/

├── services/
│   ├── forwarding/
│   └── customers/

├── templates/
│   ├── forwarding/
│   └── customers/

├── utils/
│   └── excel.ts
```

---

## Dependencies

- `mssql`
- `nodemailer`
- `exceljs`
- `dotenv`
- `typescript`

---

## License

MIT License

---

## Author

R. van Rees

---

## Repository

https://github.com/interlogicbv/report-service

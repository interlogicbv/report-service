# Report Service

The internal report service from Interlogic B.V. This service generates and emails daily forwarding performance reports and monthly overview reports based on data from an MSSQL database.

## Features

- **Forwarding Performance Report**: Fetches forwarding performance data (shipments, income, costs, efficiency) for a specified date (defaults to today) and sends an HTML email report.
- **Forwarding Overview Report**: Generates a monthly overview report with data exported to an Excel file, sent via email with the Excel attachment.
- Generates HTML email templates for reports.
- Sends reports via email using Nodemailer.
- Supports command-line arguments for report type and date/month selection.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/interlogicbv/report-service.git
   cd report-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (create a `.env` file):
   - Database connection details (MSSQL):
     - `DB_USER`: Database username
     - `DB_PASSWORD`: Database password
     - `DB_SERVER`: Database server address
     - `DB_DATABASE`: Database name
   - Email configuration (SMTP server, credentials):
     - `SMTP_HOST`: SMTP server host
     - `SMTP_PORT`: SMTP server port
     - `SMTP_USER`: SMTP username
     - `SMTP_PASS`: SMTP password
     - `DEFAULT_MAIL`: Default email recipients for performance reports (comma-separated)
   - For overview reports:
     - `OVERVIEW_MAIL_TO`: Email recipients for overview reports (comma-separated)

   Example `.env` file:

   ```
   DB_USER=myuser
   DB_PASSWORD=mypassword
   DB_SERVER=myserver
   DB_DATABASE=mydatabase

   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=myemail@example.com
   SMTP_PASS=mypassword

   DEFAULT_MAIL=recipient1@example.com,recipient2@example.com
   OVERVIEW_MAIL_TO=overview@example.com,manager@example.com
   ```

## Usage

The service accepts command-line arguments to specify which report to run and optional date/month parameters.

### Forwarding Performance Report

Run the daily forwarding performance report:

```bash
npm start -fp
```

Specify a custom date (YYYY-MM-DD):

```bash
npm start -fp -date=2023-10-15
```

### Forwarding Overview Report

Run the monthly overview report:

```bash
npm start -fo
```

Specify a custom month (YYYY-MM):

```bash
npm start -fo -month=2023-10
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

- `src/index.ts`: Main entry point with argument parsing and validation
- `src/db.ts`: Database connection setup
- `src/mail.ts`: Email sending functionality
- `src/utils/excel.ts`: Excel file generation utilities
- `src/queries/forwarding/performance.ts`: Database query for forwarding performance data
- `src/queries/forwarding/overview.ts`: Database query for overview data
- `src/services/forwarding/performance.ts`: Service logic for performance report
- `src/services/forwarding/overview.ts`: Service logic for overview report
- `src/templates/forwarding/performance.ts`: HTML email template for performance report
- `src/templates/forwarding/overview.ts`: HTML email template for overview report

## Dependencies

- `mssql`: For database connections
- `nodemailer`: For sending emails
- `exceljs`: For generating Excel files
- `dotenv`: For environment variable management
- `typescript`: For TypeScript compilation

## License

MIT License

## Author

R. van Rees

## Repository

[GitHub](https://github.com/interlogicbv/report-service)

# Report Service

The internal report service from Interlogic B.V. This service generates and emails daily forwarding performance reports based on data from an MSSQL database.

## Features

- Fetches forwarding performance data (shipments, income, costs, efficiency) for the current day
- Generates an HTML email template with the report
- Sends the report via email using Nodemailer

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
   - Database connection details (MSSQL)
   - Email configuration (SMTP server, credentials)

## Usage

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

- `src/index.ts`: Main entry point
- `src/db.ts`: Database connection setup
- `src/mail.ts`: Email sending functionality
- `src/queries/forwarding/performance.ts`: Database query for forwarding performance data
- `src/services/forwarding/performance.ts`: Service logic to run the report
- `src/templates/forwarding/performance.ts`: HTML email template generation

## Dependencies

- `mssql`: For database connections
- `nodemailer`: For sending emails
- `dotenv`: For environment variable management
- `typescript`: For TypeScript compilation

## License

MIT License

## Author

R. van Rees

## Repository

[GitHub](https://github.com/interlogicbv/report-service)

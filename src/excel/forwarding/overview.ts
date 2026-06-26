import ExcelJS from "exceljs";

export async function generateOverviewFile(rows: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  sheet.columns = [
    { header: "Plangroup", key: "Plangroup", width: 20 },
    { header: "Customer", key: "Customer", width: 50 },
    { header: "Trip", key: "Trip", width: 15 },
    { header: "Carrier", key: "Carrier", width: 25 },
    { header: "Date", key: "LoadingDate", width: 20 },
    { header: "Income", key: "Income", width: 15 },
    { header: "Costs", key: "Costs", width: 15 },
    { header: "Result", key: "Result", width: 15 },
  ];

  sheet.getRow(1).font = { bold: true };

  sheet.columns.forEach((col) => {
    col.alignment = { horizontal: "left" };
  });

  rows.forEach((row) => {
    sheet.addRow({
      Plangroup: row.Plangroup,
      Customer: row.Customer,
      Trip: row.Trip,
      Carrier: row.Carrier,
      LoadingDate: row.LoadingDate,
      Income: row.Income,
      Costs: row.Costs,
      Result: row.Result,
    });
  });

  ["Income", "Costs", "Result"].forEach((key) => {
    sheet.getColumn(key).numFmt = "€ #,##0.00;[Red]-€ #,##0.00";
  });

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

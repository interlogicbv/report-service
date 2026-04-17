import ExcelJS from "exceljs";

export async function generateShipmentsFile(rows: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Trips");

  sheet.columns = [
    { header: "Trip", key: "Trip", width: 12 },
    { header: "Route", key: "Route", width: 100 },
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
      Trip: row.Trip,
      Route: row.Route,
      Income: row.Income,
      Costs: row.Costs,
      Result: (row.Income ?? 0) - (row.Costs ?? 0),
    });
  });

  ["Income", "Costs", "Result"].forEach((key) => {
    sheet.getColumn(key).numFmt = "€ #,##0.00;[Red]-€ #,##0.00";
  });

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

import ExcelJS from "exceljs";

export async function generatePerformanceExcel(rows: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Trips");

  sheet.columns = [
    { header: "Trip", key: "tripnr", width: 12 },
    { header: "Route", key: "route", width: 25 },
    { header: "Income", key: "income", width: 15 },
    { header: "Costs", key: "costs", width: 15 },
    { header: "Result", key: "result", width: 15 },
  ];

  rows.forEach((row) => {
    sheet.addRow({
      tripnr: row.Tripnr,
      route: row.Route,
      income: row.Income,
      costs: row.Costs,
      result: (row.Income ?? 0) - (row.Costs ?? 0),
    });
  });

  sheet.getRow(1).font = { bold: true };
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

export async function generateOverviewExcel(rows: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  sheet.columns = [
    { header: "Plangroup", key: "plangroup", width: 20 },
    { header: "Trip", key: "tripnr", width: 10 },
    { header: "Relation", key: "relation", width: 25 },
    { header: "Date", key: "date", width: 15 },
    { header: "Income", key: "income", width: 15 },
    { header: "Costs", key: "costs", width: 15 },
    { header: "Result", key: "result", width: 15 },
  ];

  rows.forEach((row) => {
    sheet.addRow({
      plangroup: row.Plangroup,
      tripnr: row.Tripnr,
      relation: row.Name,
      date: row.LoadingDate,
      income: row.Income,
      costs: row.Costs,
      result: row.Result,
    });
  });

  sheet.getRow(1).font = { bold: true };
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

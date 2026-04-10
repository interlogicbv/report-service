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

  sheet.columns.forEach((col) => {
    col.alignment = { horizontal: "left" };
  });

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

  sheet.columns.forEach((col) => {
    col.alignment = { horizontal: "left" };
  });

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

export async function generateShipmentsExcel(rows: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  sheet.columns = [
    { header: "Week", key: "week", width: 10 },
    { header: "Relation", key: "relation", width: 25 },
    { header: "Date", key: "date", width: 15 },
    { header: "Reference", key: "reference", width: 20 },
    { header: "Loading City", key: "loadingCity", width: 20 },
    { header: "Loading Time", key: "loadingTime", width: 12 },
    { header: "Unloading City", key: "unloadingCity", width: 20 },
    { header: "Unloading Time", key: "unloadingTime", width: 12 },
  ];

  sheet.columns.forEach((col) => {
    col.alignment = { horizontal: "left" };
  });

  rows.forEach((row) => {
    const loading = new Date(row.LoadingTime);
    const unloading = new Date(row.UnloadingTime);

    sheet.addRow({
      week: row.Week,
      relation: row.Name,
      date: row.Date,
      reference: row.Reference,
      loadingCity: row.LoadingCity,
      loadingTime: loading,
      unloadingCity: row.UnloadingCity,
      unloadingTime: unloading,
    });
  });

  sheet.getRow(1).font = { bold: true };
  sheet.getColumn("date").numFmt = "dd-mm-yyyy";
  sheet.getColumn("loadingTime").numFmt = "hh:mm";
  sheet.getColumn("unloadingTime").numFmt = "hh:mm";

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

import { pool } from "../../../utils/db";

function addDays(date: string, days: number): string {
  const result = new Date(`${date}T00:00:00`);
  result.setDate(result.getDate() + days);

  return [
    result.getFullYear(),
    String(result.getMonth() + 1).padStart(2, "0"),
    String(result.getDate()).padStart(2, "0"),
  ].join("-");
}

async function getPerformanceDataForPeriod(
  startDate: string,
  endDate: string,
  dateBasis: "creation" | "trip" = "creation",
) {
  const db = await pool;
  const dateColumn =
    dateBasis === "trip" ? "TRIPACTIVITY.[Date]" : "TRIP.CreationDate";
  const tripActivityJoin =
    dateBasis === "trip"
      ? `INNER JOIN RP_TripActivity TRIPACTIVITY
          ON TRIPACTIVITY.TripActivitynr = TRIP.BeginTripActivity`
      : "";

  const createRequest = () =>
    db.request().input("startDate", startDate).input("endDate", endDate);

  const results = await createRequest().query(`
    SELECT 
      COUNT(*) AS Shipments,
      SUM(TRIP.Income) AS Income,
      SUM(TRIP.Costs) AS Costs,
      SUM(COALESCE(TRIP.Income, 0) - COALESCE(TRIP.Costs, 0)) AS Result
    FROM 
      RP_Trip TRIP
      ${tripActivityJoin}
    WHERE 
      TRIP.PlanStatus IN (10, 20)
      AND TRIP.Plangroup = 8
      AND ${dateColumn} >= CAST(@startDate AS DATE)
      AND ${dateColumn} < @endDate
      AND TRIP.Route IS NOT NULL;
  `);

  const incidents = await createRequest().query(`
    SELECT DISTINCT
      TRIP.Tripnr AS Trip,
      TRIP.Route AS [Route],
      ${dateColumn} AS PerformanceDate,
      TRIP.Income AS Income,
      TRIP.Costs AS Costs
    FROM 
      RP_Trip TRIP
    INNER JOIN 
      RP_ResourceCombination RC ON RC.Trip = TRIP.Tripnr
    ${tripActivityJoin}
    WHERE 
      TRIP.PlanStatus IN (10,20)
      AND TRIP.Plangroup = 8
      AND TRIP.Route IS NOT NULL
      AND ${dateColumn} >= CAST(@startDate AS DATE)
      AND ${dateColumn} < @endDate
      AND (NOT EXISTS(SELECT 1 FROM RP_CombinationCosts CC WHERE CC.ResourceCombination = RC.ResourceCombinationnr AND CC.CostsKind = 1) OR TRIP.Income IS NULL OR TRIP.Costs IS NULL);
  `);

  const shipments = await createRequest().query(`
    SELECT TRIP.Tripnr AS Trip,
          TRIP.Route AS [Route],
          ${dateColumn} AS PerformanceDate,
          TRIP.Income AS Income,
          TRIP.Costs AS Costs,
          (COALESCE(TRIP.Income, 0) - COALESCE(TRIP.Costs, 0)) AS Result
    FROM RP_Trip TRIP
    ${tripActivityJoin}
    WHERE TRIP.PlanStatus IN (10,20)
      AND TRIP.Plangroup = 8
      AND TRIP.Route IS NOT NULL
      AND ${dateColumn} >= CAST(@startDate AS DATE)
      AND ${dateColumn} < @endDate
  `);

  return {
    results: results.recordset[0],
    incidents: incidents.recordset,
    shipments: shipments.recordset,
  };
}

export async function getPerformanceData(date: string) {
  return getPerformanceDataForPeriod(date, addDays(date, 1));
}

export async function getWeeklyPerformanceData(startDate: string) {
  return getPerformanceDataForPeriod(
    startDate,
    addDays(startDate, 5),
    "trip",
  );
}

export async function getMonthlyPerformanceData(month: string) {
  const startDate = `${month}-01`;
  const nextMonth = new Date(`${startDate}T00:00:00`);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const endDate = [
    nextMonth.getFullYear(),
    String(nextMonth.getMonth() + 1).padStart(2, "0"),
    "01",
  ].join("-");

  return getPerformanceDataForPeriod(startDate, endDate, "trip");
}

import { pool } from "../../db";

export async function getDailyData() {
  const db = await pool;

  const kpiResult = await db.request().query(`
    DECLARE @Today DATE = GETDATE();

    SELECT 
        COUNT(*) AS Shipments, 
        SUM(TRIP.Income) AS Income, 
        SUM(TRIP.Costs) AS Costs,
        SUM(TRIP.Income - TRIP.Costs) AS Result,
        CAST(SUM(TRIP.Income - TRIP.Costs) * 100.0 / NULLIF(SUM(TRIP.Income), 0) AS DECIMAL(10,2)) AS Efficiency
    FROM RP_Trip TRIP
    WHERE TRIP.PlanStatus = 10 
        AND TRIP.Plangroup = 8 
        AND CAST(TRIP.CreationDate AS DATE) = @Today
        AND TRIP.Costs IS NOT NULL;
  `);

  const incidentsResult = await db.request().query(`
    DECLARE @Today DATE = GETDATE();

    SELECT 
        TRIP.Tripnr,
        TRIP.Route,
        TRIP.Income,
        TRIP.Costs
    FROM RP_Trip TRIP
    INNER JOIN RP_ResourceCombination RC 
        ON RC.Trip = TRIP.Tripnr
    WHERE TRIP.PlanStatus = 10 
    AND TRIP.Plangroup = 8
    AND TRIP.Route IS NOT NULL
    AND CAST(TRIP.CreationDate AS DATE) = @Today
    AND NOT EXISTS (
        SELECT 1
        FROM RP_CombinationCosts CC
        WHERE CC.ResourceCombination = RC.ResourceCombinationnr
          AND CC.CostsKind = 1
    );
  `);

  return {
    kpi: kpiResult.recordset[0],
    incidents: incidentsResult.recordset,
  };
}

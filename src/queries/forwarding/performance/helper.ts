import { pool } from "../../../utils/db";

export async function getPerformanceData(date: any) {
  const db = await pool;

  const results = await db.request().input("date", date).query(`
    SELECT 
      COUNT(*) AS Shipments,
      SUM(TRIP.Income) AS Income,
      SUM(TRIP.Costs) AS Costs,
      SUM(COALESCE(TRIP.Income, 0) - COALESCE(TRIP.Costs, 0)) AS Result
    FROM 
      RP_Trip TRIP
    WHERE 
      TRIP.PlanStatus IN (10, 20)
      AND TRIP.Plangroup = 8
      AND CAST(TRIP.CreationDate AS DATE) = @date
      AND TRIP.Route IS NOT NULL;
  `);

  const incidents = await db.request().input("date", date).query(`
    SELECT 
      TRIP.Tripnr AS Trip,
      TRIP.Route AS [Route],
      TRIP.Income AS Income,
      TRIP.Costs AS Costs
    FROM 
      RP_Trip TRIP
    INNER JOIN 
      RP_ResourceCombination RC ON RC.Trip = TRIP.Tripnr
    WHERE 
      TRIP.PlanStatus IN (10,20)
      AND TRIP.Plangroup = 8
      AND TRIP.Route IS NOT NULL
      AND CAST(TRIP.CreationDate AS DATE) = @date
      AND (NOT EXISTS(SELECT 1 FROM RP_CombinationCosts CC WHERE CC.ResourceCombination = RC.ResourceCombinationnr AND CC.CostsKind IN 1) OR TRIP.Income IS NULL OR TRIP.Costs IS NULL);
  `);

  const shipments = await db.request().input("date", date).query(`
    SELECT TRIP.Tripnr AS Trip,
          TRIP.Route AS [Route],
          TRIP.Income AS Income,
          TRIP.Costs AS Costs,
          (COALESCE(TRIP.Income, 0) - COALESCE(TRIP.Costs, 0)) AS Result
    FROM RP_Trip TRIP
    WHERE TRIP.PlanStatus IN (10,20)
      AND TRIP.Plangroup = 8
      AND TRIP.Route IS NOT NULL
      AND CAST(TRIP.CreationDate AS DATE) = @date
  `);

  return {
    results: results.recordset[0],
    incidents: incidents.recordset,
    shipments: shipments.recordset,
  };
}

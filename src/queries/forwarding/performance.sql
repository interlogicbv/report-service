DECLARE @date DATE = '2026-04-08';

-- Overview
SELECT COUNT(*) AS Shipments,
       SUM(TRIP.Income) AS Income,
       SUM(TRIP.Costs) AS Costs,
       SUM(COALESCE(TRIP.Income, 0) - COALESCE(TRIP.Costs, 0)) AS Result
FROM RP_Trip TRIP
WHERE TRIP.PlanStatus IN (10,
                          20)
  AND TRIP.Plangroup = 8
  AND CAST(TRIP.CreationDate AS DATE) = @date
  AND TRIP.Route IS NOT NULL;

-- Incidents
SELECT TRIP.Tripnr,
       TRIP.Route,
       TRIP.Income,
       TRIP.Costs
FROM RP_Trip TRIP
INNER JOIN RP_ResourceCombination RC ON RC.Trip = TRIP.Tripnr
WHERE TRIP.PlanStatus IN (10,20)
  AND TRIP.Plangroup = 8
  AND TRIP.Route IS NOT NULL
  AND CAST(TRIP.CreationDate AS DATE) = @date
  AND (NOT EXISTS
         (SELECT 1
          FROM RP_CombinationCosts CC
          WHERE CC.ResourceCombination = RC.ResourceCombinationnr
            AND CC.CostsKind = 1)
       OR TRIP.Income IS NULL
       OR TRIP.Costs IS NULL);

-- Shipments
SELECT TRIP.Tripnr,
       TRIP.Route,
       TRIP.Income,
       TRIP.Costs,
       (COALESCE(TRIP.Income, 0) - COALESCE(TRIP.Costs, 0)) AS Result
FROM RP_Trip TRIP
WHERE TRIP.PlanStatus IN (10,20)
  AND TRIP.Plangroup = 8
  AND TRIP.Route IS NOT NULL
  AND CAST(TRIP.CreationDate AS DATE) = @date
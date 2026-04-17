import { pool } from "../../../utils/db";

export async function getOverviewData(month: string) {
  const db = await pool;

  const result = await db.request().input("month", month).query(`
    DECLARE @start DATE = CAST(@month + '-01' AS DATE);
    DECLARE @end DATE = DATEADD(MONTH, 1, @start);

    SELECT 
        PLANGROUP.Name AS Plangroup,
        TRIP.Tripnr AS Trip,
        RELATION.Name AS Customer,
        ACTIVITY.[Date] AS LoadingDate,
        RESOURCECOMBINATION.Income AS Income,
        SUM(CASE
            WHEN COSTS.PurchaseInvoice IS NULL
                OR INVOICE.InvoiceGroup = 1 THEN COSTS.AmountEx
            ELSE 0
        END) AS Costs,
        RESOURCECOMBINATION.Income - SUM(CASE
            WHEN COSTS.PurchaseInvoice IS NULL
                OR INVOICE.InvoiceGroup = 1 THEN COSTS.AmountEx
            ELSE 0
        END) AS Result
    FROM 
        RP_CombinationCosts COSTS
        INNER JOIN RM_Relation RELATION ON COSTS.Creditor = RELATION.Relationnr
        INNER JOIN RP_Trip TRIP ON COSTS.Trip = TRIP.Tripnr
        INNER JOIN SO_PlanGroup PLANGROUP ON TRIP.PlanGroup = PLANGROUP.PlanGroupnr
        INNER JOIN RP_TripActivity ACTIVITY ON TRIP.BeginTripActivity = ACTIVITY.TripActivitynr
        INNER JOIN RP_ResourceCombination RESOURCECOMBINATION ON COSTS.ResourceCombination = RESOURCECOMBINATION.ResourceCombinationnr
        LEFT JOIN PO_PurchaseInvoice INVOICE ON COSTS.PurchaseInvoice = INVOICE.PurchaseInvoiceNr
    WHERE 
        COSTS.DoNotInvoice IS NULL
        AND ACTIVITY.[Date] >= @start
        AND ACTIVITY.[Date] < @end
    GROUP BY 
        PLANGROUP.Name,
        TRIP.Tripnr,
        RELATION.Name,
        ACTIVITY.[Date],
        RESOURCECOMBINATION.Income
        HAVING SUM(CASE
            WHEN COSTS.CostsKind = 1 THEN 1
            ELSE 0
        END) > 0
    ORDER BY 
        TRIP.Tripnr ASC;
  `);

  return {
    rows: result.recordset,
  };
}

import { pool } from "../../../utils/db";

export async function getOverviewData(month: string) {
  const db = await pool;

  const result = await db.request().input("month", month).query(`
    DECLARE @start DATE = CAST(@month + '-01' AS DATE);
    DECLARE @end DATE = DATEADD(MONTH, 1, @start);

    SELECT 
        PLANGROUP.Name AS Plangroup,
        CUSTOMER.Name AS Customer,
        TRIP.Tripnr AS Trip,
        RELATION.Name AS Carrier,
        TRIPACTIVITY.[Date] AS LoadingDate,
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
        INNER JOIN RP_TripActivity TRIPACTIVITY ON TRIP.BeginTripActivity = TRIPACTIVITY.TripActivitynr
        INNER JOIN RP_ResourceCombination RESOURCECOMBINATION ON COSTS.ResourceCombination = RESOURCECOMBINATION.ResourceCombinationnr
        LEFT JOIN PO_PurchaseInvoice INVOICE ON COSTS.PurchaseInvoice = INVOICE.PurchaseInvoiceNr
        OUTER APPLY (
            SELECT TOP 1 C.Name
            FROM RP_TripActivity TA
            INNER JOIN SO_Activity A ON TA.Activity = A.Activitynr
            INNER JOIN SO_SalesOrder SO ON A.SalesOrder = SO.SalesOrdernr
            INNER JOIN RM_Relation C ON SO.Customer = C.Relationnr
            WHERE TA.Trip = TRIP.Tripnr
            ORDER BY TA.[Date], TA.TripActivitynr
        ) CUSTOMER
    WHERE 
        COSTS.DoNotInvoice IS NULL
        AND TRIPACTIVITY.[Date] >= @start
        AND TRIPACTIVITY.[Date] < @end
    GROUP BY 
        PLANGROUP.Name,
        CUSTOMER.Name,
        TRIP.Tripnr,
        RELATION.Name,
        TRIPACTIVITY.[Date],
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

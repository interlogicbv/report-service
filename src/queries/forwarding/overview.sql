DECLARE @StartDate DATE = '2026-03-01';
DECLARE @EndDate DATE = '2026-04-01'

SELECT PLANGROUP.Name AS Plangroup,
        TRIP.Tripnr,
        RELATION.Name,
        ACTIVITY.[Date] AS LoadingDate,
        RESOURCECOMBINATION.Income,
        SUM(CASE
                WHEN COSTS.PurchaseInvoice IS NULL
                    OR INVOICE.InvoiceGroup = 1 THEN COSTS.AmountEx
                ELSE 0
            END) AS Costs,
        RESOURCECOMBINATION.Income - SUM(CASE
                                            WHEN COSTS.PurchaseInvoice IS NULL
                                                OR INVOICE.InvoiceGroup = 1 THEN COSTS.AmountEx
                                            ELSE 0
                                        END) AS RESULT
FROM RP_CombinationCosts COSTS
INNER JOIN RM_Relation RELATION ON COSTS.Creditor = RELATION.Relationnr
INNER JOIN RP_Trip TRIP ON COSTS.Trip = TRIP.Tripnr
INNER JOIN SO_PlanGroup PLANGROUP ON TRIP.PlanGroup = PLANGROUP.PlanGroupnr
INNER JOIN RP_TripActivity ACTIVITY ON TRIP.BeginTripActivity = ACTIVITY.TripActivitynr
INNER JOIN RP_ResourceCombination RESOURCECOMBINATION ON COSTS.ResourceCombination = RESOURCECOMBINATION.ResourceCombinationnr
LEFT JOIN PO_PurchaseInvoice INVOICE ON COSTS.PurchaseInvoice = INVOICE.PurchaseInvoiceNr
WHERE COSTS.DoNotInvoice IS NULL
    AND ACTIVITY.[Date] >= @StartDate
    AND ACTIVITY.[Date] < @EndDate
GROUP BY PLANGROUP.Name,
        TRIP.Tripnr,
        RELATION.Name,
        ACTIVITY.[Date],
        RESOURCECOMBINATION.Income
HAVING SUM(CASE
                WHEN COSTS.CostsKind = 1 THEN 1
                ELSE 0
            END) > 0
ORDER BY TRIP.Tripnr ASC;
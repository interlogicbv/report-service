import { pool } from "../../../utils/db";

export async function getDocumentsData() {
  const db = await pool;
  const excludedCreditors = [
    ...new Set(
      (process.env.CARRIER_DOCUMENTS_EXCLUDED_CREDITORS ?? "")
        .split(";")
        .map((name) => name.trim())
        .filter(Boolean),
    ),
  ];
  const request = db.request();
  const excludedParameters = excludedCreditors.map((name, index) => {
    const parameter = `excludedCreditor${index}`;
    request.input(parameter, name);
    return `@${parameter}`;
  });
  const creditorFilter = excludedParameters.length
    ? `AND (CR.Name IS NULL OR CR.Name NOT IN (${excludedParameters.join(", ")}))`
    : "";

  const result = await request.query(`
    SELECT
        LEG.[Week],
        PG.Name AS Plangroup,
        RM.Name AS Customer,
        LEG.Reference AS Reference,
        RC.Trip AS Trip,
        BA.Date AS LoadingDate,
        BA.Address_CountryCode AS LoadingCountry,
        BA.Address_ZIPcode AS LoadingZIP,
        BA.Address_Cityname AS LoadingCity,
        BA.Address_Address1 AS LoadingAddress,
        EA.Date AS UnloadingDate,
        EA.Address_CountryCode AS UnloadingCountry,
        EA.Address_ZIPcode AS UnloadingZIP,
        EA.Address_Cityname AS UnloadingCity,
        EA.Address_Address1 AS UnloadingAddress,
        CR.Name AS Creditor,
        CP.EMail AS Email
    FROM
        SO_Leg LEG
        INNER JOIN SO_SalesOrder SO ON LEG.SalesOrder = SO.SalesOrdernr
        INNER JOIN RM_Relation RM ON SO.Customer = RM.Relationnr
        INNER JOIN SO_Activity BA ON LEG.BeginActivity = BA.Activitynr
        INNER JOIN SO_Activity EA ON LEG.EndActivity = EA.Activitynr
        INNER JOIN RP_ResourceCombination RC ON EA.ResourceCombination = RC.ResourceCombinationnr
        LEFT JOIN RP_ResourceCompany R ON RC.Truck = R.Resource
        LEFT JOIN RM_Relation CR ON R.Creditor = CR.Relationnr
        INNER JOIN SO_PlanGroup PG ON LEG.PlanGroup = PG.PlanGroupnr
        OUTER APPLY (
            SELECT TOP 1 CP.EMail
            FROM RM_Contactperson CP
            WHERE CP.Relation = CR.Relationnr
            AND CP.EMail IS NOT NULL
            ORDER BY CP.Contactpersonnr
        ) CP
    WHERE
        LEG.CMRReceived IS NULL
        AND R.ID IS NULL
        AND LEG.Invoiced IS NULL
        AND LEG.LegStatus != 25
        AND PG.Name != 'Trucking'
        ${creditorFilter}
        AND EA.Date < DATEADD(DAY, -7, CAST(GETDATE() AS DATE))
    ORDER BY
        BA.Date ASC;
  `);

  return {
    rows: result.recordset,
  };
}

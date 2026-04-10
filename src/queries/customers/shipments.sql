SELECT LEG.[Week],
    RM.Name,
    LEG.Reference,
    BA.Date AS Date,
    BA.Address_Cityname AS LoadingCity,
    BA.[Time] AS LoadingTime,
    EA.Address_Cityname AS UnloadingCity,
    EA.[Time] AS UnloadingTime
FROM SO_Leg LEG
INNER JOIN SO_SalesOrder SO ON LEG.SalesOrder = SO.SalesOrdernr
INNER JOIN RM_Relation RM ON SO.Customer = RM.Relationnr
INNER JOIN SO_Activity BA ON LEG.BeginActivity = BA.Activitynr
INNER JOIN SO_Activity EA ON LEG.EndActivity = EA.Activitynr
WHERE LEG.Week = 14
AND LEG.Year = 5
AND SO.Customer = 16116
ORDER BY BA.Date ASC, BA.[Time] ASC;
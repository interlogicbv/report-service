import dotenv from "dotenv";
dotenv.config();

export const generatePerformanceTemplate = (
  date: any,
  data: any,
  incidents: any[],
) => {
  const incidentIncome = incidents.reduce(
    (sum, row) => sum + Number(row.Income || 0),
    0,
  );

  const incidentCosts = incidents.reduce(
    (sum, row) => sum + Number(row.Costs || 0),
    0,
  );

  const correctedIncome = Number(data.Income || 0) - incidentIncome;
  const correctedCosts = Number(data.Costs || 0) - incidentCosts;
  const result = correctedIncome - correctedCosts;
  const goal = Number(process.env.FORWARDING_PERFORMANCE_DAILY_GOAL) || 7500;
  const percentage = Math.max(0, Math.round((result / goal) * 100));
  const efficiency =
    ((correctedIncome - correctedCosts) / correctedIncome) * 100;
  const blocks = Math.max(0, Math.min(Math.round((result / goal) * 10), 10));

  const incidentRows = incidents.length
    ? incidents
        .map(
          (row) => `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #eee;">${row.Tripnr}</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">${row.Route}</td>
          <td style="padding:8px; border-bottom:1px solid #eee; text-align:left; color:#27ae60; font-weight:bold;">
            €${Number(row.Income).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </td>
          <td style="padding:8px; border-bottom:1px solid #eee; text-align:left; color:#e74c3c; font-weight:bold;">
            €${Number(row.Costs).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </td>
        </tr>
      `,
        )
        .join("")
    : `
    <tr>
      <td colspan="4" style="padding:8px; text-align:center; color:#999;">
        No incidents 🎉
      </td>
    </tr>
  `;

  // kleur bepalen
  let statusColor = "#e74c3c"; // rood
  if (result >= goal)
    statusColor = "#27ae60"; // groen
  else if (result >= goal * 0.75)
    statusColor = "#f1c40f"; // geel
  else if (result >= goal * 0.5) statusColor = "#e67e22"; // oranje

  // blokjes genereren
  const bar = Array.from({ length: 10 })
    .map(
      (_, i) => `
      <td style="
        width:10%;
        height:8px;
        background:${i < blocks ? statusColor : "#ddd"};
      "></td>
    `,
    )
    .join("");

  return `
      <div style="margin:0; padding:0; background-color:#ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:0 auto; border:1px solid #e0e0e0; border-top:5px solid #00b0bd; font-family: 'Segoe UI', Arial, sans-serif;">
          
          <!-- HEADER -->
          <tr>
            <td style="padding:15px; background-color:#f8f9fa;">
              <table width="100%">
                <tr>
                  <td style="text-align:left;">
                    <img src="https://www.inter-logic.eu/wp-content/uploads/2023/10/Logo-Interlogic.png" width="120" style="display:block;">
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:10px;">
                    <h1 style="margin:0; font-size:20px; color:#001a2d;">Forwarding Performance Report</h1>
                    <p style="margin:5px 0 0 0; font-size:13px; color:#666;">
                      Data from ${date}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- KPI CARDS -->
          <tr>
            <td style="padding:10px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- SHIPMENTS -->
                <tr>
                  <td style="padding:5px;">
                    <table width="100%" style="background:#f4f4f4; border-radius:5px;">
                      <tr>
                        <td style="padding:12px; text-align:center;">
                          <p style="font-size:11px; color:#888; margin:0; font-weight:bold;">SOLD SHIPMENTS</p>
                          <p style="font-size:18px; font-weight:bold; margin:5px 0 0;">
                            ${data.Shipments - incidents.length}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- PROFIT -->
                <tr>
                  <td style="padding:5px;">
                    <table width="100%" style="background:#f4f4f4; border-radius:5px;">
                      <tr>
                        <td style="padding:12px; text-align:center;">
                          
                          <p style="font-size:11px; color:#888; margin:0; font-weight:bold;">PROFIT</p>

                          <p style="font-size:18px; font-weight:bold; margin:5px 0 8px; color:${statusColor};">
                            ${result.toLocaleString("nl-NL", { style: "currency", currency: "EUR" })}
                          </p>

                          <!-- BLOKJES PROGRESS BAR -->
                          <table width="100%" cellpadding="0" cellspacing="2" style="margin-top:8px;">
                            <tr>
                              ${bar}
                            </tr>
                          </table>

                          <p style="font-size:11px; margin:6px 0 0; color:#666;">
                            €${result.toLocaleString("nl-NL")} / €${goal.toLocaleString("nl-NL")} (${percentage}%)
                          </p>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- DETAILS -->
          <tr>
            <td style="padding:15px;">
              <h3 style="margin:0 0 10px 0; font-size:16px; color:#001a2d;">
                Details
              </h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:13px;">
            
        <tr>
          <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">
            Revenue
          </th>
          <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">
            Costs
          </th>
          <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">
            Result
          </th>
          <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">
            Efficiency
          </th>
        </tr>

        <tr>
          <td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold; color:#27ae60;">
            + €${correctedIncome.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </td>

          <td style="padding:8px; border-bottom:1px solid #eee; text-align:left; font-weight:bold; color:#e74c3c;">
            - €${Math.abs(correctedCosts).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </td>

          <td style="padding:8px; border-bottom:1px solid #eee; text-align:left; font-weight:bold;">
            €${result.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </td>

          <td style="padding:8px; border-bottom:1px solid #eee; text-align:left; font-weight:bold;">
            ${efficiency.toFixed(2)}%
          </td>
        </tr>

      </table>
            

        </td>
            </td>
          </tr>

          <!-- INCIDENTS -->
          <tr>
            <td style="padding:15px;">
              <h3 style="margin:0 0 10px 0; font-size:16px; color:#001a2d;">
                Incidents
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:13px;">
                <tr>
                  <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Shipment</th>
                  <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Route</th>
                  <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Revenue</th>
                  <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Costs</th>
                </tr>
                ${incidentRows}
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:12px; background:#f1f1f1; text-align:center; font-size:11px; color:#999;">
              This is an automated message.
            </td>
          </tr>

        </table>
      </div>
    `;
};

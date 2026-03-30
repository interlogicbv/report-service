import dotenv from "dotenv";
dotenv.config();

export const generateTemplate = (data: any) => {
  const goal = Number(process.env.FORWARDING_DAILY_GOAL) || 7500;
  const result = Number(data.Result) || 0;
  const percentage = Math.max(0, Math.round((result / goal) * 100));

  // aantal blokjes (0–10)
  const blocks = Math.max(0, Math.min(Math.round((result / goal) * 10), 10));

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
              <h1 style="margin:0; font-size:20px; color:#001a2d;">Forwarding Update</h1>
              <p style="margin:5px 0 0 0; font-size:13px; color:#666;">
                Data from ${new Date().toLocaleString("nl-NL")}
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
                      ${data.Shipments}
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

          <!-- EFFICIENCY -->
          <tr>
            <td style="padding:5px;">
              <table width="100%" style="background:#f4f4f4; border-radius:5px;">
                <tr>
                  <td style="padding:12px; text-align:center;">
                    <p style="font-size:11px; color:#888; margin:0; font-weight:bold;">EFFICIENCY</p>
                    <p style="font-size:18px; font-weight:bold; margin:5px 0 0;">
                      ${data.Efficiency}%
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
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-size:14px;">
              Revenue
            </td>
            <td style="padding:10px; border-bottom:1px solid #eee; text-align:right; font-weight:bold; color:#27ae60;">
              + €${data.Income.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </td>
          </tr>

          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-size:14px;">
              Costs
            </td>
            <td style="padding:10px; border-bottom:1px solid #eee; text-align:right; font-weight:bold; color:#e74c3c;">
              - €${data.Costs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </td>
          </tr>

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

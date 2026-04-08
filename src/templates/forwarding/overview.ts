import dotenv from "dotenv";
dotenv.config();

export const generateOverviewTemplate = (month: any, rows: any[]) => {
  console.table([
    {
      month: month,
      shipments: rows.length,
    },
  ]);

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
                    <h1 style="margin:0; font-size:20px; color:#001a2d;">Forwarding Overview Report</h1>
                    <p style="margin:5px 0 0 0; font-size:13px; color:#666;">
                      Data from ${month}
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
                            ${rows.length}
                          </p>
                        </td>
                      </tr>
                    </table>
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

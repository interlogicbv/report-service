export const generateShipmentsTemplate = (week: number, rows: any[]) => {
  const detailRows = rows
    .map((row) => {
      const date = new Date(row.Date).toLocaleDateString("nl-NL");

      const loadingTime = new Date(row.LoadingTime).toLocaleTimeString(
        "nl-NL",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      );

      const unloadingTime = new Date(row.UnloadingTime).toLocaleTimeString(
        "nl-NL",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      );

      return `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #eee;">
            ${date}
          </td>

          <td style="padding:8px; border-bottom:1px solid #eee;">
            ${row.Reference}
          </td>

          <td style="padding:8px; border-bottom:1px solid #eee;">
            ${loadingTime} @ ${row.LoadingCity}
          </td>

          <td style="padding:8px; border-bottom:1px solid #eee;">
            ${unloadingTime} @ ${row.UnloadingCity}
          </td>

          <td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">
            -
          </td>
        </tr>
      `;
    })
    .join("");

  return `
  <div style="margin:0; padding:0; background-color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:800px; margin:0 auto; border:1px solid #e0e0e0; border-top:5px solid #00b0bd; font-family:'Segoe UI', Arial, sans-serif;">

      <!-- HEADER -->
      <tr>
        <td style="padding:15px; background-color:#f8f9fa;">
          <table width="100%">
            <tr>
              <td style="text-align:left;">
                <img src="https://www.inter-logic.eu/wp-content/uploads/2023/10/Logo-Interlogic.png" width="120">
              </td>
            </tr>
            <tr>
              <td style="padding-top:10px;">
                <h1 style="margin:0; font-size:20px; color:#001a2d;">
                  Customer Performance Report
                </h1>
                <p style="margin:5px 0 0 0; font-size:13px; color:#666;">
                  Week ${week}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- KPI -->
      <tr>
        <td style="padding:10px;">
          <table width="100%">
            <tr>
              <td style="padding:5px;">
                <table width="100%" style="background:#f4f4f4; border-radius:5px;">
                  <tr>
                    <td style="padding:12px; text-align:center;">
                      <p style="font-size:11px; color:#888; margin:0; font-weight:bold;">
                        SHIPMENTS
                      </p>
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

      <!-- DETAILS -->
      <tr>
        <td style="padding:15px;">
          <h3 style="margin:0 0 10px 0; font-size:16px; color:#001a2d;">
            Details
          </h3>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:13px;">
            <tr>
              <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Date</th>
              <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Reference</th>
              <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Loading</th>
              <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Unloading</th>
              <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Result</th>
            </tr>

            ${detailRows}

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

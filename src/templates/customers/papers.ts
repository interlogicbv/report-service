export const generatePapersTemplate = (rows: any[]) => {
  const detailRows = rows
    .map((row) => {
      const date = row.UnloadingDate
        ? new Date(row.UnloadingDate).toLocaleDateString("en-GB")
        : "-";
      return `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #eee;">
          ${row.Trip || "-"}
        </td>
        <td style="padding:8px; border-bottom:1px solid #eee;">
          ${row.LoadingCity || "-"}
        </td>
        <td style="padding:8px; border-bottom:1px solid #eee;">
          ${row.UnloadingCity || "-"}
        </td>
        <td style="padding:8px; border-bottom:1px solid #eee;">
          ${date}
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
        <img src="https://www.inter-logic.eu/wp-content/uploads/2023/10/Logo-Interlogic.png" width="120">
        <h1 style="margin:10px 0 0 0; font-size:20px; color:#001a2d;">
          Missing CMR Documents
        </h1>
      </td>
    </tr>

    <!-- INTRO -->
    <tr>
      <td style="padding:15px; font-size:13px; color:#333;">
        <p>Dear Sir/Madam,</p>

        <p>
          According to our administration, we have not yet received the signed CMR document(s) for the shipment listed below.
        </p>

        <p>
          We kindly request you to send us the missing document(s) as soon as possible.
        </p>

        <p style="margin-top:10px;">
          These shipments were completed more than 7 days ago.
        </p>
      </td>
    </tr>

    <!-- DETAILS TABLE -->
    <tr>
      <td style="padding:15px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:13px;">
          <tr>
            <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Trip</th>
            <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Loading</th>
            <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Unloading</th>
            <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Date</th>
          </tr>

          ${detailRows}

        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:15px; font-size:13px; color:#333;">
        <p>
          Please send the signed CMR to:
          <a href="mailto:invoices@inter-logic.eu" style="font-weight:bold; color: #00b0bd">invoices@inter-logic.eu</a>
        </p>

        <p>
          If you have already sent the documents, please disregard this message.
        </p>

        <p>Thank you for your cooperation.</p>
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

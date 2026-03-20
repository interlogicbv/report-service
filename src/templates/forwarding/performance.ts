export const generateTemplate = (data: any) => {
  const isPositive = data.Result >= 0;
  const statusColor = isPositive ? "#27ae60" : "#e74c3c";

  const logoUrl =
    "https://www.inter-logic.eu/wp-content/uploads/2023/10/Logo-Interlogic.png";

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-top: 5px solid #00b0bd;">
        
        <div style="padding: 20px; background-color: #f8f9fa;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="left" style="padding: 10px;">
                        <img src="${logoUrl}" alt="Interlogic Logo" width="150" style="display: block; border: 0; outline: none; text-decoration: none;">
                    </td>
                    <td align="right">
                        <h1 style="color: #001a2d; margin: 0; font-size: 24px; line-height: 1.2;">Forwarding Update</h1>
                        <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Gegevens van ${new Date().toLocaleDateString("nl-NL")}</p>
                    </td>
                </tr>
            </table>
        </div>
        
        <div style="padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px; table-layout: fixed;">
                <tr>
                    <td style="padding: 16px;">
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center;">
                            <p style="font-size: 10px; color: #888; text-transform: uppercase; margin: 0; line-height: 1.2; font-weight: bold;">Zendingen</p>
                            <p style="font-size: 20px; font-weight: bold; color: #333; margin: 0; line-height: 1.2;">${data.Shipments}</p>
                        </div>
                    </td>
                    <td style="padding: 16px;">
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center;">
                            <p style="font-size: 10px; color: #888; text-transform: uppercase; margin: 0; line-height: 1.2; font-weight: bold;">Resultaat</p>
                            <p style="font-size: 20px; font-weight: bold; color: ${statusColor}; margin: 0; line-height: 1.2;">${data.Result.toLocaleString(
                              "nl-NL",
                              {
                                style: "currency",
                                currency: "EUR",
                              },
                            )}</p>
                        </div>
                    </td>
                    <td style="padding: 16px;">
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center;">
                            <p style="font-size: 10px; color: #888; text-transform: uppercase; margin: 0; line-height: 1.2; font-weight: bold;">Efficiency</p>
                            <p style="font-size: 20px; font-weight: bold; color: #333; margin: 0; line-height: 1.2;">${data.Efficiency}%</p>
                        </div>
                    </td>
                </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #333; font-size: 14px;">Opbrengst</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold; color: #27ae60; font-size: 14px;">
                        + €${data.Income.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #333; font-size: 14px;">Kosten</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold; color: #e74c3c; font-size: 14px;">
                        - €${data.Costs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                    </td>
                </tr>
            </table>
        </div>

        <div style="padding: 15px; background-color: #f1f1f1; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Dit is een geautomatiseerd bericht.</p>
        </div>
    </div>
  `;
};

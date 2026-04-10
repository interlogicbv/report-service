import { getShipments } from "../../queries/customers/shipments";
import { generateShipmentsExcel } from "../../utils/excel";
import { generateShipmentsTemplate } from "../../templates/customers/shipments";
import { sendMail } from "../../mail";
import * as dotenv from "dotenv";
dotenv.config();

export async function runShipmentsReport({
  customer,
  week,
  year,
}: {
  customer: number;
  week: number;
  year: number;
}) {
  const { rows } = await getShipments(customer, week, year);

  if (!rows.length) {
    console.log("No data found");
    return;
  }

  const excelBuffer = await generateShipmentsExcel(rows);

  await sendMail({
    to: process.env.CUSTOMER_SHIPMENTS_MAIL_TO?.split(","),
    subject: `Shipments Performance Report - Week ${week}`,
    html: generateShipmentsTemplate(week, rows),
    attachments: [
      {
        filename: `shipments-report-${week}.xlsx`,
        content: excelBuffer as Buffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  console.log("Shipments Performance Report sent!");
}

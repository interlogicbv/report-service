import { getOverviewData } from "../../queries/forwarding/overview";
import { generateOverviewExcel } from "../../utils/excel";
import { generateOverviewTemplate } from "../../templates/forwarding/overview";
import { sendMail } from "../../mail";
import * as dotenv from "dotenv";
dotenv.config();

export async function runOverviewReport({ month }: { month: string }) {
  const { rows } = await getOverviewData(month);

  if (!rows.length) {
    console.log("No data found");
    return;
  }

  const excelBuffer = await generateOverviewExcel(rows);

  await sendMail({
    to: process.env.FORWARDING_OVERVIEW_MAIL_TO?.split(","),
    subject: `Overview Report - ${month}`,
    html: generateOverviewTemplate(month, rows),
    attachments: [
      {
        filename: `overview-report-${month}.xlsx`,
        content: excelBuffer as Buffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  console.log("Forwarding Overview Report sent!");
}

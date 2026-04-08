import { getPerformanceData } from "../../queries/forwarding/performance";
import { generatePerformanceTemplate } from "../../templates/forwarding/performance";
import { sendMail } from "../../mail";
import * as dotenv from "dotenv";
import { generatePerformanceExcel } from "../../utils/excel";

dotenv.config();

type Props = {
  date: string;
};

export async function runPerformanceReport({ date }: Props) {
  const { kpi, incidents, rows } = await getPerformanceData(date);

  if (!kpi) {
    console.log("No data found");
    return;
  }

  const excelBuffer = await generatePerformanceExcel(rows);

  await sendMail({
    to: process.env.FORWARDING_PERFORMANCE_MAIL_TO?.split(","),
    subject: `Forwarding Report - ${date}`,
    html: generatePerformanceTemplate(date, kpi, incidents),
    attachments: [
      {
        filename: `performance-report-${date}.xlsx`,
        content: excelBuffer as Buffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  console.log("Forwarding Performance Report sent!");
}

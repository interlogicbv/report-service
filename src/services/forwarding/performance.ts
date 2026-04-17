import * as dotenv from "dotenv";
import { getPerformanceData } from "../../queries/forwarding/performance/helper";
import { generateShipmentsFile } from "../../excel/forwarding/performance";
import { generatePerformanceMail } from "../../templates/forwarding/performance";
import { sendMail } from "../../utils/mail";

dotenv.config();

type Props = {
  date: string;
};

export async function runPerformanceReport({ date }: Props) {
  const { results, incidents, shipments } = await getPerformanceData(date);

  if (!results) {
    console.log("No data found");
    return;
  }

  const excelFile = await generateShipmentsFile(shipments);

  await sendMail({
    to: process.env.FORWARDING_PERFORMANCE_MAIL_TO?.split(","),
    subject: `Forwarding Report - ${date}`,
    html: generatePerformanceMail(date, results, incidents),
    attachments: [
      {
        filename: `performance-${date}.xlsx`,
        content: excelFile,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  console.log("Forwarding Performance Report sent!");
}

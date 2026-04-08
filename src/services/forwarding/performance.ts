import { getPerformanceData } from "../../queries/forwarding/performance";
import { generatePerformanceTemplate } from "../../templates/forwarding/performance";
import { sendMail } from "../../mail";
import * as dotenv from "dotenv";

dotenv.config();

type Props = {
  date: string;
};

export async function runPerformanceReport({ date }: Props) {
  const { kpi, incidents } = await getPerformanceData(date);

  if (!kpi) {
    console.log("No data found");
    return;
  }

  await sendMail({
    to: process.env.FORWARDING_PERFORMANCE_MAIL_TO?.split(","),
    subject: `Forwarding Report - ${date}`,
    html: generatePerformanceTemplate(date, kpi, incidents),
  });

  console.log("Forwarding Performance Report sent!");
}

import { getDailyData } from "../../queries/forwarding/performance";
import { generateDailyTemplate } from "../../templates/forwarding/performance";
import { sendMail } from "../../mail";

const args = process.argv.slice(2);
const dateArg = args.find((arg) => arg.startsWith("--date="));
const inputDate = dateArg ? dateArg.split("=")[1] : null;

export async function runDailyForwardingReport() {
  const date = inputDate || new Date().toISOString().split("T")[0];
  const { kpi, incidents } = await getDailyData(date);

  if (!kpi) {
    console.log("No data found");
    return;
  }

  await sendMail(
    `Forwarding Daily Report - ${date}`,
    generateDailyTemplate(date, kpi, incidents),
  );
  console.log("Daily Forwarding Report sent!");
}

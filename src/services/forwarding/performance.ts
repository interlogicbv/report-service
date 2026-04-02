import { getDailyData } from "../../queries/forwarding/performance";
import { generateDailyTemplate } from "../../templates/forwarding/performance";
import { sendMail } from "../../mail";

export async function runDailyForwardingReport() {
  const { kpi, incidents } = await getDailyData();

  if (!kpi) {
    console.log("No data found");
    return;
  }

  generateDailyTemplate(kpi, incidents);

  await sendMail(
    "Daily Forwarding Report",
    generateDailyTemplate(kpi, incidents),
  );
  console.log("Daily Forwarding Report sent!");
}

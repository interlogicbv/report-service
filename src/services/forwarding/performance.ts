import { getDailyData } from "../../queries/forwarding/performance";
import { generateDailyTemplate } from "../../templates/forwarding/performance";
import { sendMail } from "../../mail";

export async function runDailyForwardingReport() {
  const data = await getDailyData();

  if (!data.length) {
    console.log("No data found");
    return;
  }

  await sendMail("Daily Forwarding Report", generateDailyTemplate(data[0]));
  console.log("Daily Forwarding Report sent!");
}

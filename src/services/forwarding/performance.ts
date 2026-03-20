import { getData } from "../../queries/forwarding/performance";
import { generateTemplate } from "../../templates/forwarding/performance";
import { sendMail } from "../../mail";

export async function run() {
  const data = await getData();

  if (!data.length) {
    console.log("No data found");
    return;
  }

  await sendMail("Forwarding Performance Report", generateTemplate(data[0]));

  console.log("Mail sent!");
}

import * as dotenv from "dotenv";
import { getOverviewData } from "../../queries/forwarding/overview/helper";
import { generateOverviewFile } from "../../excel/forwarding/overview";
import { generateOverviewMail } from "../../templates/forwarding/overview";
import { sendMail } from "../../utils/mail";

dotenv.config();

type Props = {
  date: string;
};

export async function runOverviewReport({ date }: Props) {
  const { rows } = await getOverviewData(date);

  if (!rows.length) {
    console.log("No data found");
    return;
  }

  const excelFile = await generateOverviewFile(rows);

  await sendMail({
    to: process.env.FORWARDING_OVERVIEW_MAIL_TO?.split(","),
    subject: `Overview Report - ${date}`,
    html: generateOverviewMail(date, rows),
    attachments: [
      {
        filename: `overview-${date}.xlsx`,
        content: excelFile,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  console.log("Forwarding Overview Report sent!");
}

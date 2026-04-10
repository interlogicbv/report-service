import { sendMail } from "../../mail";
import * as dotenv from "dotenv";
import { getPapers } from "../../queries/customers/papers";
import { generatePapersTemplate } from "../../templates/customers/papers";
dotenv.config();

type Shipment = {
  Email: string;
  Reference: string;
  LoadingCity: string;
  UnloadingCity: string;
  Date: string;
};

function groupByEmail(rows: Shipment[]) {
  return rows.reduce(
    (acc, row) => {
      if (!row.Email) return acc;

      if (!acc[row.Email]) {
        acc[row.Email] = [];
      }

      acc[row.Email].push(row);
      return acc;
    },
    {} as Record<string, Shipment[]>,
  );
}

export async function runMissingPapers() {
  const { rows } = await getPapers();

  if (!rows.length) {
    console.log("No data found");
    return;
  }

  const grouped = groupByEmail(rows);

  for (const [email, shipments] of Object.entries(grouped)) {
    await sendMail({
      to: [email],
      subject: `Missing CMR Documents`,
      html: generatePapersTemplate(shipments),
    });

    console.log(`Mail sent to ${email} (${shipments.length} shipments)`);
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("All Missing CMR emails sent!");
}

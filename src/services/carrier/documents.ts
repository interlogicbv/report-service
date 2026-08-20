import { getDocumentsData } from "../../queries/carrier/documents/helper";
import { generatePapersMail } from "../../templates/carrier/documents";
import { sendMail } from "../../utils/mail";

type Shipment = {
  Email: string;
  LoadingCity: string;
  UnloadingCity: string;
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

export async function runCarrierDocuments() {
  const { rows } = await getDocumentsData();

  if (!rows.length) {
    console.log("No data found");
    return;
  }

  const grouped = groupByEmail(rows);

  for (const [email, shipments] of Object.entries(grouped)) {
    await sendMail({
      to: [email],
      subject: `Missing Documents`,
      html: generatePapersMail(shipments),
    });

    console.log(`Mail sent to ${email} (${shipments.length} shipments)`);
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("All Missing CMR emails sent!");
}

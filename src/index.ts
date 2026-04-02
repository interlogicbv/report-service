import { runDailyForwardingReport } from "./services/forwarding/performance";

async function main() {
  try {
    await runDailyForwardingReport();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();

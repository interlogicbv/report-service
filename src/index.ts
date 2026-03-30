import { runDailyForwardingReport } from "./services/forwarding/performance";

runDailyForwardingReport().catch((err) => {
  console.error("Error:", err);
});

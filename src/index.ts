import { run as runForwardingReport } from "./services/forwarding/performance";

runForwardingReport().catch((err) => {
  console.error("Error:", err);
});

import { run } from "./services/forwarding/performance";

run().catch((err) => {
  console.error("Error:", err);
});

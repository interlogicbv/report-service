import { runShipmentsReport } from "./services/customers/shipments";
import { runOverviewReport } from "./services/forwarding/overview";
import { runPerformanceReport } from "./services/forwarding/performance";
import { runMissingPapers } from "./services/customers/papers";

/* ======================
   DATE HELPERS
====================== */

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentYearMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getCurrentYearWeek() {
  const now = new Date();
  return `${now.getFullYear()}-${String(getWeekNumber(now)).padStart(2, "0")}`;
}

function getWeekNumber(date: Date) {
  const tempDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
}

/* ======================
   ARG PARSING
====================== */

type Mode = "performance" | "overview" | "customers" | "papers";

function parseArgs() {
  const args = process.argv.slice(2);

  const getFlag = (flag: string) => args.includes(flag);

  const getParam = (name: string) => {
    const arg = args.find((a) => a.startsWith(`-${name}=`));
    return arg ? arg.split("=")[1] : null;
  };

  const modeFlags = {
    performance: getFlag("-fp"),
    overview: getFlag("-fo"),
    customers: getFlag("-cp"),
    papers: getFlag("-papers"),
  };

  const activeModes = Object.entries(modeFlags).filter(([, v]) => v);

  if (activeModes.length !== 1) {
    throw new Error("Use exactly one of -fp, -fo, -cp or -papers");
  }

  const mode = activeModes[0][0] as Mode;

  return {
    mode,
    rawDate: getParam("date"),
    customer: getParam("customer"),
  };
}

/* ======================
   DATE RESOLUTION
====================== */

function resolveDate(mode: Mode, rawDate?: string | null) {
  if (mode === "papers") return null;

  if (!rawDate) {
    if (mode === "performance") return getToday();
    if (mode === "overview") return getCurrentYearMonth();
    if (mode === "customers") return getCurrentYearWeek();
  }

  return rawDate!;
}

/* ======================
   VALIDATION
====================== */

function validate(mode: Mode, date: string) {
  const patterns = {
    performance: /^\d{4}-\d{2}-\d{2}$/,
    overview: /^\d{4}-\d{2}$/,
    customers: /^\d{4}-\d{2}$/,
    papers: /.*/,
  };

  if (!patterns[mode].test(date)) {
    const formats = {
      performance: "YYYY-MM-DD",
      overview: "YYYY-MM",
      customers: "YYYY-WW",
      papers: "-",
    };

    throw new Error(`Invalid date format. Use ${formats[mode]}`);
  }
}

/* ======================
   MAIN
====================== */

async function main() {
  try {
    const { mode, rawDate, customer } = parseArgs();
    const date = resolveDate(mode, rawDate);

    if (mode !== "papers") {
      validate(mode, date!);
    }

    if (mode === "customers" && !customer) {
      throw new Error("Missing required parameter: -customer=<number>");
    }

    if (mode === "performance") {
      console.log(`Running Performance Report for ${date}`);
      await runPerformanceReport({ date: date! });
    }

    if (mode === "overview") {
      console.log(`Running Overview Report for ${date}`);
      await runOverviewReport({ month: date! });
    }

    if (mode === "customers") {
      const [year, week] = date!.split("-").map(Number);

      console.log(
        `Running Shipments Report for customer ${customer} in week ${date}`,
      );

      await runShipmentsReport({
        customer: Number(customer),
        year,
        week,
      });
    }

    if (mode === "papers") {
      console.log("Running Missing CMR Papers job");
      await runMissingPapers();
    }

    process.exit(0);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();

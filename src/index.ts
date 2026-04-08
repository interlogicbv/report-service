import { runOverviewReport } from "./services/forwarding/overview";
import { runPerformanceReport } from "./services/forwarding/performance";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function parseArgs() {
  const args = process.argv.slice(2);

  const getFlag = (flag: string) => args.includes(flag);

  const getParam = (name: string) => {
    const arg = args.find((a) => a.startsWith(`-${name}=`));
    return arg ? arg.split("=")[1] : null;
  };

  const rawDate = getParam("date");
  const rawMonth = getParam("month");

  return {
    performance: getFlag("-fp"),
    overview: getFlag("-fo"),
    date: rawDate || getToday(),
    month: rawMonth || getCurrentYearMonth(),
    rawDate,
    rawMonth,
  };
}

function validateArgs({
  performance,
  overview,
  rawDate,
  rawMonth,
  date,
  month,
}: any) {
  if (performance && rawDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }
  }

  if (overview && rawMonth) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new Error("Invalid month format. Use YYYY-MM");
    }
  }

  if (performance && overview) {
    throw new Error("Choose either -fp or -fo, not both");
  }
}

async function main() {
  const parsed = parseArgs();

  try {
    validateArgs(parsed);

    if (parsed.performance) {
      console.log(`Running Forwarding Performance Report for ${parsed.date}`);
      await runPerformanceReport({ date: parsed.date });
    } else if (parsed.overview) {
      console.log(
        `Running Forwarding Overview Report for month ${parsed.month}`,
      );
      await runOverviewReport({ month: parsed.month });
    } else {
      console.log("Use -fp or -fo");
      process.exit(1);
    }

    process.exit(0);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();

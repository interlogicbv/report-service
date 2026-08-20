import {
  runMonthlyPerformanceReport,
  runPerformanceReport,
  runWeeklyPerformanceReport,
} from "./services/forwarding/performance";
import { runCarrierDocuments } from "./services/carrier/documents";

/**
 * Helpers
 */
function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const daysSinceMonday = (day + 6) % 7;

  now.setDate(now.getDate() - daysSinceMonday);

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * Types
 */
type ModeWithDate = {
  flag: string;
  description: string;
  getDefaultDate: () => string;
  validate: (date: string) => boolean;
  format: string;
  run: (date: string) => Promise<void>;
  log: (date: string) => string;
};

type ModeWithoutDate = {
  flag: string;
  description: string;
  run: () => Promise<void>;
  log: () => string;
};

type ModeConfig = ModeWithDate | ModeWithoutDate;

/**
 * Type guard
 */
function isModeWithDate(config: ModeConfig): config is ModeWithDate {
  return "getDefaultDate" in config;
}

/**
 * Mode configuration
 */
const MODES = {
  forwardingPerformance: {
    flag: "-fp",
    description: "Run forwarding performance report",
    getDefaultDate: getToday,
    validate: (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d),
    format: "YYYY-MM-DD",
    run: async (date: string) => {
      await runPerformanceReport({ date });
    },
    log: (date: string) => `Running Forwarding Performance Report for ${date}`,
  },

  forwardingWeeklyPerformance: {
    flag: "-fwp",
    description: "Run forwarding weekly performance report",
    getDefaultDate: getCurrentWeekStart,
    validate: (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d),
    format: "YYYY-MM-DD",
    run: async (date: string) => {
      await runWeeklyPerformanceReport({ date });
    },
    log: (date: string) =>
      `Running Forwarding Weekly Performance Report for the week containing ${date}`,
  },

  forwardingMonthlyPerformance: {
    flag: "-fmp",
    description: "Run forwarding monthly performance report",
    getDefaultDate: getCurrentYearMonth,
    validate: (d: string) => /^\d{4}-\d{2}$/.test(d),
    format: "YYYY-MM",
    run: async (date: string) => {
      await runMonthlyPerformanceReport({ date });
    },
    log: (date: string) =>
      `Running Forwarding Monthly Performance Report for ${date}`,
  },

  carrierDocuments: {
    flag: "-cd",
    description: "Run carrier documents job",
    run: async () => {
      await runCarrierDocuments();
    },
    log: () => "Running Carrier Documents job",
  },
} as const satisfies Record<string, ModeConfig>;

type Mode = keyof typeof MODES;

/**
 * Argument parsing
 */
function parseArgs() {
  const args = process.argv.slice(2);

  const selected = Object.entries(MODES).filter(([, config]) =>
    args.includes(config.flag),
  );

  if (selected.length !== 1) {
    throw new Error(
      `Use exactly one mode:\n${Object.values(MODES)
        .map((m) => `  ${m.flag.padEnd(4)} ${m.description}`)
        .join("\n")}`,
    );
  }

  const [mode, config] = selected[0] as [Mode, ModeConfig];

  const rawDate = args.find((a) => a.startsWith("-date="))?.split("=")[1];

  return { mode, config, rawDate };
}

/**
 * Main
 */
async function main() {
  try {
    const { config, rawDate } = parseArgs();

    if (isModeWithDate(config)) {
      const date = rawDate ?? config.getDefaultDate();

      if (!config.validate(date)) {
        throw new Error(`Invalid date format. Use ${config.format}`);
      }

      console.log(config.log(date));
      await config.run(date);
    } else {
      console.log(config.log());
      await config.run();
    }

    process.exit(0);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();

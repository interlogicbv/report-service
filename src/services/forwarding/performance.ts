import {
  getPerformanceData,
  getMonthlyPerformanceData,
  getWeeklyPerformanceData,
} from "../../queries/forwarding/performance/helper";
import { generateShipmentsFile } from "../../excel/forwarding/performance";
import { generatePerformanceMail } from "../../templates/forwarding/performance";
import { sendMail } from "../../utils/mail";

type Props = {
  date: string;
};

function formatDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getWeekStart(date: string): string {
  const weekStart = new Date(`${date}T00:00:00`);
  const daysSinceMonday = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - daysSinceMonday);

  return formatDate(weekStart);
}

function shiftDate(date: string, days: number): string {
  const shifted = new Date(`${date}T00:00:00`);
  shifted.setDate(shifted.getDate() + days);
  return formatDate(shifted);
}

function getCorrectedResult(data: any, incidents: any[]): number {
  const incidentIncome = incidents.reduce(
    (sum, row) => sum + Number(row.Income || 0),
    0,
  );
  const incidentCosts = incidents.reduce(
    (sum, row) => sum + Number(row.Costs || 0),
    0,
  );

  return (
    Number(data.Income || 0) -
    incidentIncome -
    (Number(data.Costs || 0) - incidentCosts)
  );
}

function getDailyBreakdown(
  shipments: any[],
  incidents: any[],
  startDate: string,
  numberOfDays: number,
) {
  const incidentTrips = new Set(incidents.map((row) => row.Trip));
  const validShipments = shipments.filter(
    (row) => !incidentTrips.has(row.Trip),
  );

  return Array.from({ length: numberOfDays }, (_, offset) => {
    const date = shiftDate(startDate, offset);
    const dateValue = new Date(`${date}T00:00:00`);

    if (dateValue.getDay() === 0 || dateValue.getDay() === 6) {
      return null;
    }

    const rows = validShipments.filter(
      (row) => formatDate(new Date(row.PerformanceDate)) === date,
    );

    return {
      date,
      shipments: rows.length,
      result: rows.reduce(
        (sum, row) =>
          sum + Number(row.Income || 0) - Number(row.Costs || 0),
        0,
      ),
      goal: 7500,
    };
  }).filter((row) => row !== null);
}

export async function runPerformanceReport({ date }: Props) {
  const previousDate = shiftDate(date, -1);
  const [current, previous] = await Promise.all([
    getPerformanceData(date),
    getPerformanceData(previousDate),
  ]);
  const { results, incidents, shipments } = current;

  if (!results) {
    console.log("No data found");
    return;
  }

  const excelFile = await generateShipmentsFile(shipments);

  await sendMail({
    to: process.env.FORWARDING_PERFORMANCE_MAIL_TO?.split(","),
    subject: `Forwarding Report - ${date}`,
    html: generatePerformanceMail(date, results, incidents, {
      comparison: {
        label: `Previous day (${previousDate})`,
        result: getCorrectedResult(previous.results, previous.incidents),
      },
    }),
    attachments: [
      {
        filename: `performance-${date}.xlsx`,
        content: excelFile,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  console.log("Forwarding Performance Report sent!");
}

export async function runWeeklyPerformanceReport({ date }: Props) {
  const weekStart = getWeekStart(date);
  const previousWeekStart = shiftDate(weekStart, -7);
  const [current, previous] = await Promise.all([
    getWeeklyPerformanceData(weekStart),
    getWeeklyPerformanceData(previousWeekStart),
  ]);
  const { results, incidents, shipments } = current;

  if (!results) {
    console.log("No data found");
    return;
  }

  const excelFile = await generateShipmentsFile(shipments);
  const endDate = new Date(`${weekStart}T00:00:00`);
  endDate.setDate(endDate.getDate() + 4);
  const endDateText = formatDate(endDate);

  await sendMail({
    to: process.env.FORWARDING_PERFORMANCE_MAIL_TO?.split(","),
    subject: `Forwarding Weekly Performance Report - ${weekStart}`,
    html: generatePerformanceMail(weekStart, results, incidents, {
      goal: 5 * 7500,
      title: "Forwarding Weekly Performance Report",
      dateLabel: `Data from ${weekStart} through ${endDateText}`,
      comparison: {
        label: `Previous week (${previousWeekStart})`,
        result: getCorrectedResult(previous.results, previous.incidents),
      },
      dailyBreakdown: getDailyBreakdown(shipments, incidents, weekStart, 5),
    }),
    attachments: [
      {
        filename: `weekly-performance-${weekStart}.xlsx`,
        content: excelFile,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  console.log("Forwarding Weekly Performance Report sent!");
}

function getWeekdayCount(month: string): number {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1, 1);
  let weekdays = 0;

  while (date.getMonth() === monthNumber - 1) {
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      weekdays += 1;
    }
    date.setDate(date.getDate() + 1);
  }

  return weekdays;
}

export async function runMonthlyPerformanceReport({ date }: Props) {
  const currentMonth = new Date(`${date}-01T00:00:00`);
  currentMonth.setMonth(currentMonth.getMonth() - 1);
  const previousMonth = formatDate(currentMonth).slice(0, 7);
  const [current, previous] = await Promise.all([
    getMonthlyPerformanceData(date),
    getMonthlyPerformanceData(previousMonth),
  ]);
  const { results, incidents, shipments } = current;

  if (!results) {
    console.log("No data found");
    return;
  }

  const excelFile = await generateShipmentsFile(shipments);
  const weekdays = getWeekdayCount(date);
  const goal = weekdays * 7500;

  await sendMail({
    to: process.env.FORWARDING_PERFORMANCE_MAIL_TO?.split(","),
    subject: `Forwarding Monthly Performance Report - ${date}`,
    html: generatePerformanceMail(date, results, incidents, {
      goal,
      title: "Forwarding Monthly Performance Report",
      dateLabel: `Data for ${date} (${weekdays} weekdays)`,
      comparison: {
        label: `Previous month (${previousMonth})`,
        result: getCorrectedResult(previous.results, previous.incidents),
      },
      dailyBreakdown: getDailyBreakdown(
        shipments,
        incidents,
        `${date}-01`,
        new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)), 0).getDate(),
      ),
    }),
    attachments: [
      {
        filename: `monthly-performance-${date}.xlsx`,
        content: excelFile,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  console.log("Forwarding Monthly Performance Report sent!");
}

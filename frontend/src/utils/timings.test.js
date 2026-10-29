import { summariseTimings } from "./timings.js";

const row = (dayOfWeek, startTime, endTime, sessionType = "UNISEX") => ({ id: `${dayOfWeek}${startTime}`, dayOfWeek, startTime, endTime, sessionType });

it("combines identical weekdays into one entry and keeps Saturday and Sunday separate", () => {
  const rows = [];
  for (let d = 1; d <= 5; d++) rows.push(row(d, "06:00", "12:00"), row(d, "12:00", "15:00", "LADIES_ONLY"), row(d, "15:00", "22:00"));
  rows.push(row(6, "07:00", "13:00"), row(0, "08:00", "12:00"));
  const s = summariseTimings(rows);
  expect(s.combined).toBe(true);
  expect(s.weekdays).toHaveLength(1);
  expect(s.weekdays[0].label).toBe("Monday – Friday");
  expect(s.saturday).toEqual([row(6, "07:00", "13:00")]);
  expect(s.sunday).toEqual([row(0, "08:00", "12:00")]);
  expect(s.ladiesText).toBe("12:00 PM – 3:00 PM on weekdays");
});

it("splits weekdays only when they genuinely differ and never invents weekend hours", () => {
  const rows = [1, 2, 3, 4].map((d) => row(d, "06:00", "22:00")).concat([row(5, "06:00", "20:00")]);
  const s = summariseTimings(rows);
  expect(s.combined).toBe(false);
  expect(s.weekdays.map((g) => g.label)).toEqual(["Mon – Thu", "Friday"]);
  expect(s.saturday).toEqual([]);
  expect(s.sunday).toEqual([]);
  expect(s.ladiesText).toBeNull();
});

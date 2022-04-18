import { DateTime } from "luxon";

export const formatToUTC = (datetime: DateTime | string): string => {
  let datetimeUTC: DateTime;

  if (typeof datetime === "string") {
    datetimeUTC = DateTime.fromISO(datetime, { zone: "UTC" });
  } else {
    datetimeUTC = datetime;
    datetimeUTC.setZone("UTC");
  }

  return datetimeUTC.toISO()?.slice(0, -8);
};

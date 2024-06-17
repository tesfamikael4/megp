export default function currentTime(now: Date = new Date()) {
  const tzoffset = now.getTimezoneOffset() * 60000; //offset in milliseconds
  const withoutTimezone = new Date(now.valueOf() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return withoutTimezone;
}

const convertToMilliseconds = (timeString: string) => {
  const timeValue = parseInt(timeString.slice(0, -1), 10);
  const timeUnit = timeString.slice(-1);

  switch (timeUnit) {
    case "d":
      return timeValue * 24 * 60 * 60 * 1000; // days to milliseconds
    case "h":
      return timeValue * 60 * 60 * 1000; // hours to milliseconds
    case "m":
      return timeValue * 60 * 1000; // minutes to milliseconds
    case "s":
      return timeValue * 1000; // seconds to milliseconds
    default:
      throw new Error("Invalid time format");
  }
};

export default convertToMilliseconds;

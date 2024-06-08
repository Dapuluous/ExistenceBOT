async function consoleLogText(logType, text) {
  let logPrefix;
  switch (logType) {
    case "info":
      logPrefix = "[INFO]";
      break;
    case "warning":
      logPrefix = "[WARNING]";
      break;
    case "error":
      logPrefix = "[ERROR]";
      break;
    default:
      break;
  }

  return console.log(`${logPrefix} - ${text}`);
}

module.exports = {
  consoleLogText
}
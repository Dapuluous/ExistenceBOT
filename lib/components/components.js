const fs = require('fs').promises;
const { primaryColor, dangerColor, warningColor, osuColor } = require('../const/color');
const { existsSync } = require('fs');

// ========== Recycleable Functions ==========
async function textConfirmation(msg, type) {
  var noticeMsg = ':bulb: Notice';
  var warningMsg = ':warning: Warning';
  var errorMsg = ':anger: Error';
  var birthdayMsg = ':tada: Wake up! Somebody is having a birthday now!';

  var colorSet, msgSet;

  if (type == "primary") {
    colorSet = primaryColor;
    msgSet = noticeMsg;
  } else if (type == "warning") {
    colorSet = warningColor;
    msgSet = warningMsg;
  } else if (type == "danger") {
    colorSet = dangerColor;
    msgSet = errorMsg;
  } else if (type == "birthday") {
    colorSet = osuColor;
    msgSet = birthdayMsg;
  }

  const textEmbed = {
    color: colorSet,
    fields: [
      {
        name: msgSet,
        value: msg,
        inline: true,
      },
    ],
  };

  return textEmbed;
}

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

// ========== File Mutations ==========
async function ensureFileExists(filePath) {
  if (!existsSync(filePath)) {
    await fs.writeFile(filePath, '');
  }
}

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return data ? JSON.parse(data) : {};
  } catch (err) {
    consoleLogText('error', `Error reading file: ${err}`);
    throw err;
  }
}

async function writeFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    consoleLogText('info', 'Profile has been saved');
  } catch (err) {
    consoleLogText('error', `Error writing file: ${err}`);
    throw err;
  }
}


module.exports = {
  consoleLogText,
  textConfirmation,
  ensureFileExists,
  readFile,
  writeFile
}
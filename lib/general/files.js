const { consoleLogText } = require('../templates/components');
const fs = require('fs').promises;
const { existsSync } = require('fs');

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
  ensureFileExists,
  readFile,
  writeFile
}
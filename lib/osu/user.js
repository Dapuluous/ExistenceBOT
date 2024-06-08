const axios = require('axios');
const { getTokenV2 } = require('../osu/osuAuth');
const { osuAPIv2 } = require('../const/url');
const { ensureFileExists, readFile, writeFile } = require('../general/files');
const { consoleLogText } = require('../templates/consoleLog');

const osuUserInformationDirectory = './storage/osuUser.json';

// ========== osuAPI interaction ========== 
async function getUserProfile(id, mode) {
  try {
    const accessToken = await getTokenV2();
    const response = await axios.get(`${osuAPIv2}/users/${id}/${mode}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

// ========== Regular function ==========
async function saveUserInformation(id, nickname, discordID) {
  const newObj = {
    [discordID]: {
      id,
      nickname,
    },
  };

  try {
    await ensureFileExists(osuUserInformationDirectory);
    const json = await readFile(osuUserInformationDirectory);
    json[discordID] = newObj[discordID];
    await writeFile(osuUserInformationDirectory, json);
  } catch (err) {
    console.error("Error processing user information:", err);
  }
}

module.exports = {
  getUserProfile,
  saveUserInformation
}
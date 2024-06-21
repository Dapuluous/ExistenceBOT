const axios = require('axios');
const fs = require('fs');
const https = require('https');
const { Beatmap, Calculator } = require('rosu-pp');
const { osuAPIv2, osuUrl } = require('../const/url');
const { getTokenV2 } = require('../auth/osu-auth');
const { ensureFileExists, readFile, writeFile } = require('./components');
const { osuMods } = require('../const/string');
const osuUserInformationDirectory = './storage/osuUser.json';

// ========== osuAPI interaction ========== 
async function getBeatmapInfo(id) {
  try {
    const accessToken = await getTokenV2();
    const response = await axios.get(`${osuAPIv2}/beatmaps/${id}`, {
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

// ========== Recycleable Functions ==========
async function beatmapTotalLengthFormatting(length) {
  const minutes = Math.floor(length / 60);
  const remainingSeconds = length % 60;
  const formattedLength = `${minutes}:${remainingSeconds}`;
  return formattedLength;
}

async function beatmapDownload(id) {
  const file = `${id}.osu`;
  const url = `${osuUrl}/osu/${id}`;
  const fileDir = `./files/osuDifficulty/${file}`;

  if (fs.existsSync(`./files/osuDifficulty/${file}`)) {
    console.log(`[Beatmap Download] - ${file} already exists, skipping download.`);
    return file;
  } else {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        const fileStream = fs.createWriteStream(fileDir);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve(file);
          console.log(`[Beatmap Download] - ${file} has been downloaded`);
        });

        fileStream.on('error', (err) => {
          reject(err);
          console.log(`[Beatmap Download] - Download Failed: ${err}`);
        });
      })
    });
  }
}

async function calculateBeatmapPP(file, mode) {
  const map = new Beatmap({ path: `./files/osuDifficulty/${file}` });
  const allModsCalculation = new Map();
  const modsList = osuMods;

  modsList.forEach(function (value, key) {
    const score = {
      mode: mode,
      mods: value,
    };

    const calculate = new Calculator(score);
    const maxAttrs = calculate.performance(map);

    allModsCalculation.set(key, Math.floor(maxAttrs.pp));
  });

  return allModsCalculation;
}

async function convertGamemodeString(mode) {
  if (mode == "osu") {
    return "";
  } else if (mode == "fruits") {
    return "catch";
  } else {
    return mode;
  }
}

async function convertGamemodeToNumber(mode) {
  if (mode == "osu") {
    return 0;
  } else if (mode == "taiko") {
    return 1;
  } else if (mode == "fruits") {
    return 2;
  } else if (mode == "mania") {
    return 3;
  } else {
    return 0;
  }
}

async function getBeatmapPP(mode, id) {
  const file = await beatmapDownload(id);
  const modeNumber = await convertGamemodeToNumber(mode);
  const calculateDifficulty = await calculateBeatmapPP(file, modeNumber);
  return calculateDifficulty;
}

async function separateBeatmapModeAndID(url) {
  try {
    let osuURLCheck = url.includes(`${osuUrl}/beatmapsets/`);

    if (osuURLCheck == true) {
      let urlSeparation = url.split('#')[1];
      return urlSeparation.split('/');
    } else {
      return null;
    }
  } catch(e) {
    return null;
  }
}

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
    return null;
  }
}

module.exports = {
  beatmapTotalLengthFormatting,
  convertGamemodeString,
  getBeatmapInfo,
  getUserProfile,
  getBeatmapPP,
  saveUserInformation,
  separateBeatmapModeAndID
}
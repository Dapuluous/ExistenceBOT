const axios = require('axios');
const fs = require('fs');
const https = require('https');
const { Beatmap, Calculator } = require('rosu-pp');
const { osuAPIv2, osuUrl } = require('../const/url');
const { getTokenV2 } = require('./osuAuth');
const { convertGamemodeString, convertGamemodeToNumber } = require('../general/convert');

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

// ========== Regular function ==========
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

async function beatmapDelete(id) {
  const filename = `${id}.osu`;

  try {
    await fs.unlink(`./files/osuDifficulty/${filename}`);
    return console.log(`Successfully deleted ${filename}`);
  } catch (e) {
    console.log(e);
    return null;
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

async function getBeatmapPP(mode, id) {
  const file = await beatmapDownload(id);
  const modeNumber = await convertGamemodeToNumber(mode);
  const calculateDifficulty = await calculateBeatmapPP(file, modeNumber);
  return calculateDifficulty;
}

async function separateBeatmapModeAndID(url) {
  let osuURLCheck = url.includes(`${osuUrl}/beatmapsets/`);

  if (osuURLCheck == true) {
    let urlSeparation = url.split('#')[1];
    return urlSeparation.split('/');
  } else {
    return null;
  }
}

// ========== Const function ==========
const osuMods = new Map([
  ["nm", 0],
  ["hd", 8],
  ["hr", 16],
  ["hdhr", 24],
  ["dt", 64],
  ["hddt", 72],
  ["ez", 2],
  ["fl", 1024],
  ["ezdt", 66],
  ["ezfl", 1026],
  ['dthrhd', 88],
  ['dtflhr', 1104]
]);

module.exports = {
  getBeatmapInfo,
  // =====
  convertGamemodeString,
  getBeatmapPP,
  beatmapTotalLengthFormatting,
  separateBeatmapModeAndID
}
const { osuAPIv1, osuAPIv2 } = require('../const/url');
const { convertGamemodeToNumber } = require('../const/func');
const axios = require('axios');
const { beatmapUserScore, beatmapInfo } = require('./beatmap.old')
require('dotenv').config();

async function convertUserUrl(accessToken, nickname) {
  try {
    const res = await axios.get(`${osuAPIv2}/users/${nickname}`, {
      headers: {
        'Authorization': "Bearer " + accessToken
      }
    })
    
    return res.data.id;
  } catch (error) {
    console.error('Error fetching URL:', error);
    return false;
  }
}

async function getUserProfile(accessToken, userId, mode) {
  const res = await axios.get(`${osuAPIv2}/users/${userId}/${mode}`, {
    headers: {
      'Authorization': "Bearer " + accessToken
    }
  })

  return res;
}

async function getUserProfileLegacy(userId, mode) {
  let gameModeConverted = await convertGamemodeToNumber(mode);
  const res = await axios.get(`${osuAPIv1}/get_user?k=${process.env.OSU_V1_API_KEY}&u=${userId}&m=${gameModeConverted}`);

  let arrCountRank = [res.data[0].count_rank_ss, res.data[0].count_rank_ssh, res.data[0].count_rank_s, res.data[0].count_rank_sh, res.data[0].count_rank_a];
  return arrCountRank;
}

async function getUserRecentActivity(accessToken, userId) {
  const res = await axios.get(`${osuAPIv2}/users/${userId}/recent_activity`, {
    headers: {
      'Authorization': "Bearer " + accessToken
    }
  })

  return res;
}

async function getUserTopPlay(accessToken, userId, mode) {
  var gameModeConverted;

  switch (mode) {
    case "osu":
      gameModeConverted = 0
      break;
    case "taiko":
      gameModeConverted = 1
      break;
    case "fruits":
      gameModeConverted = 2
      break;
    case "mania":
      gameModeConverted = 3
      break;
    default:
      gameModeConverted = 0
  }

  const res = await axios.get(`${osuAPIv1}/get_user_best?k=${process.env.OSU_V1_API_KEY}&u=${userId}&m=${gameModeConverted}&limit=3`);

  let topArr = [];

  for (x = 0; x < res.data.length; x++) {
    const beatmapRes = await beatmapInfo(accessToken, res.data[x].beatmap_id);
    const beatmapData = beatmapRes.data;

    const beatmapScoreRes = await beatmapUserScore(accessToken, res.data[x].beatmap_id, userId);
    const beatmapScoreData = beatmapScoreRes.data;

    let beatmapV2 = [
      [beatmapData.url],
      [`${beatmapData.beatmapset.artist} - ${beatmapData.beatmapset.title} (${beatmapData.version})`],
      [`${(beatmapScoreData.score.accuracy * 100).toFixed(2)}%`],
      [beatmapScoreData.score.pp],
      [beatmapData.difficulty_rating],
      [beatmapScoreData.score.rank],
      [`${beatmapScoreData.score.mods}`],
    ]

    topArr.push(beatmapV2);
  }

  return topArr;
}

module.exports = { convertUserUrl, getUserProfile, getUserProfileLegacy, getUserRecentActivity, getUserTopPlay }
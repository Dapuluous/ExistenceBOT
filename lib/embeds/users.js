const { osuUrl } = require('../const/url.js');
const { osuColor } = require('../const/color.js');
const { osuRankSSH, osuRankSS, osuRankSH, osuRankS, osuRankA } = require('../const/string.js');
const { gamemodeNameConvert, convertToUtcPlus7 } = require('../const/func.js');

async function showUserInfo(data, mode, userTopScores, userCountRank) {
  modeText = await gamemodeNameConvert(mode);

  const showEmbed = {
    color: osuColor,
    author: {
      name: `${data.username} (#${data.statistics.global_rank} | ${data.country.name} #${data.statistics.country_rank})`,
      url: `${osuUrl}/users/${data.id}`,
    },
    thumbnail: {
      url: data.avatar_url,
    },
    fields: [
      {
        name: 'Peak Rank',
        value: `#${data.rank_highest.rank}`,
        inline: true,
      },
      {
        name: 'PP',
        value: `${Math.floor(data.statistics.pp)}pp`,
        inline: true,
      },
      {
        name: 'Accuracy',
        value: `${data.statistics.hit_accuracy.toFixed(2)}%`,
        inline: true,
      },
      {
        name: 'Count Rank Collections',
        value: `${osuRankSS} ${userCountRank[0]} • ${osuRankSSH} ${userCountRank[1]} • ${osuRankS} ${userCountRank[2]} • ${osuRankSH} ${userCountRank[3]} • ${osuRankA} ${userCountRank[4]}`,
      },
      {
        name: `Top 3 plays of the selected gamemode:`,
        value: "",
      },
    ],
    image: {
      url: data.cover_url,
    },
    timestamp: new Date().toISOString(),
    footer: {
      text: `osu!${modeText}`,
    },
  };

  // Loop to add top 3 plays dynamically
  for (let i = 0; i < userTopScores.length && i < 3; i++) {
    const scoreData = userTopScores[i];

    showEmbed.fields.push({
      name: `${scoreData[5]} Rank ★ ${scoreData[4]} ▸ ${scoreData[2]} (${scoreData[3]} pp) ${(scoreData[6] != '') ? '▸ ' + scoreData[6] : ''}`,
      value: `${scoreData[1]}\n[Link](${scoreData[0]})`,
      inline: false,
    });
  }

  return showEmbed;
}

async function showRecentActivity(data) {
  console.log(data);
  var mods = (data.mods.length != 0) ? data.mods.join("") : "None";
  var pp = (data.pp != null) ? data.pp.toFixed(2) : 0;

  modeText = await gamemodeNameConvert(data.mode);

  const showEmbed = {
    color: osuColor,
    author: {
      name: `${data.beatmapset.artist} - ${data.beatmapset.title} (${data.beatmap.version})`,
      url: data.beatmap.url
    },
    thumbnail: {
      url: data.user.avatar_url,
    },
    fields: [
      {
        name: 'Accuracy',
        value: `${(data.accuracy * 100).toFixed(2)}%`,
        inline: true,
      },
      {
        name: 'Mods',
        value: mods,
        inline: true,
      },
      {
        name: 'pp',
        value: pp,
        inline: true,
      },
      {
        name: 'Combo Count',
        value: `${data.statistics.count_300}/${data.statistics.count_100}/${data.statistics.count_50}/${data.statistics.count_miss}`,
        inline: true,
      },
      {
        name: 'Max Combo',
        value: data.max_combo,
        inline: true,
      },
      {
        name: 'Full Combo',
        value: data.perfect,
        inline: true,
      },
    ],
    image: {
      url: data.beatmapset.covers.cover,
    },
    timestamp: new Date().toISOString(),
    footer: {
      text: `Played by ${data.user.username} | osu!${modeText}`,
    }
  }

  return showEmbed;
}

async function showRecentActivityCompare(data, metadata) {
  var mods = (data.mods.length != 0) ? data.mods.join("") : "None";
  var pp = (data.pp != null) ? data.pp.toFixed(2) : 0;

  modeText = await gamemodeNameConvert(data.mode);

  const showEmbed = {
    color: osuColor,
    author: {
      name: `${metadata.beatmapset.artist} - ${metadata.beatmapset.title} (${data.beatmap.version})`,
      url: data.beatmap.url
    },
    thumbnail: {
      url: data.user.avatar_url,
    },
    fields: [
      {
        name: 'Accuracy',
        value: `${(data.accuracy * 100).toFixed(2)}%`,
        inline: true,
      },
      {
        name: 'Mods',
        value: mods,
        inline: true,
      },
      {
        name: 'pp',
        value: pp,
        inline: true,
      },
      {
        name: 'Combo Count',
        value: `${data.statistics.count_300}/${data.statistics.count_100}/${data.statistics.count_50}/${data.statistics.count_miss}`,
        inline: true,
      },
      {
        name: 'Max Combo',
        value: data.max_combo,
        inline: true,
      },
      {
        name: 'Full Combo',
        value: data.perfect,
        inline: true,
      },
    ],
    image: {
      url: metadata.beatmapset.covers.cover,
    },
    timestamp: await convertToUtcPlus7(data.created_at),
    footer: {
      text: `Played by ${data.user.username} | osu!${modeText}`,
    }
  }

  return showEmbed;
}

module.exports = { showUserInfo, showRecentActivity, showRecentActivityCompare }
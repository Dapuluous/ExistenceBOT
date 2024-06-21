const { osuColor } = require('../../const/color');
const { osuUrl } = require('../../const/url');
const { convertGamemodeString } = require('../../components/components-osu');
const { osuRankSSH, osuRankSS, osuRankSH, osuRankS, osuRankA } = require('../../const/emoji');

async function userProfileEmbeds(data) {
  let mode = await convertGamemodeString(data.playmode);
  const grades = `${osuRankSSH} ${data.statistics.grade_counts.ssh} • ${osuRankSS} ${data.statistics.grade_counts.ss} • ` +
    `${osuRankSH} ${data.statistics.grade_counts.sh} • ${osuRankS} ${data.statistics.grade_counts.s} • ` +
    `${osuRankA} ${data.statistics.grade_counts.a}`

  const embed = {
    color: osuColor,
    author: {
      name: `➤ ${data.username} • Global #${data.statistics.global_rank} (${data.country.name} #${data.statistics.country_rank})`,
      url: `${osuUrl}/${data.id}`,
    },
    thumbnail: {
      url: data.avatar_url,
    },
    description: grades,
    fields: [
      {
        name: 'Peak Rank',
        value: `#${data.rank_highest.rank}`,
        inline: true,
      },
      {
        name: 'Performance Points',
        value: `${Math.floor(data.statistics.pp)}pp`,
        inline: true,
      },
      {
        name: 'Accuracy',
        value: `${data.statistics.hit_accuracy.toFixed(2)}%`,
        inline: true,
      },
    ],
    image: {
      url: data.cover_url,
    },
    footer: {
      text: `Showing osu!${mode}'s statistics`,
    },
  };

  return embed;
}

module.exports = {
  userProfileEmbeds
}
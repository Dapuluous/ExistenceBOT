const { osuColor } = require('../../const/color');
const { beatmapTotalLengthFormatting, convertGamemodeString } = require('../../osu/beatmap');
const { osuNomod, osuHidden, osuHardrock, osuDoubletime, osuEasy, osuFlashlight } = require('../../const/emoji');

async function osuBeatmapInfoEmbeds(data, pp) {
  // # Convert hit length to readable minutes:seconds format
  let formattedLength = await beatmapTotalLengthFormatting(data.total_length);
  let mode = await convertGamemodeString(data.mode);

  const ppcalcSingleMod = `${osuNomod} ${pp.get("nm")}pp\n` +
    `${osuHidden} ${pp.get("hd")}pp\n` +
    `${osuHardrock} ${pp.get("hr")}pp\n` +
    `${osuDoubletime} ${pp.get("dt")}pp\n` +
    `${osuEasy} ${pp.get("ez")}pp\n` +
    `${osuFlashlight} ${pp.get("fl")}pp\n`

  const ppcalcDoubleMod = `${osuHidden}${osuHardrock} ${pp.get("hdhr")}pp\n` +
    `${osuHidden}${osuDoubletime} ${pp.get("hddt")}pp\n` +
    `${osuEasy}${osuDoubletime} ${pp.get("ezdt")}pp\n` +
    `${osuEasy}${osuFlashlight} ${pp.get("ezfl")}pp\n`

  const ppcalcTriplePlusMod = `${osuDoubletime}${osuHardrock}${osuHidden} ${pp.get("dthrhd")}pp\n` + 
  `${osuDoubletime}${osuFlashlight}${osuHardrock} ${pp.get("dtflhr")}pp\n`;

  const embed = {
    color: osuColor,
    author: {
      name: `${data.beatmapset.artist} - ${data.beatmapset.title} (${data.version})`,
      url: data.url,
    },
    description: `Beatmap by ${data.beatmapset.creator}`,
    fields: [
      {
        name: 'Circle Size',
        value: `${data.cs}`,
        inline: true,
      },
      {
        name: 'Approach Rate',
        value: `${data.ar}`,
        inline: true,
      },
      {
        name: 'Overall Difficulty',
        value: `${data.accuracy}`,
        inline: true,
      },
      {
        name: 'Star Rating',
        value: `${data.difficulty_rating}`,
        inline: true,
      },
      {
        name: 'BPM',
        value: `${data.bpm}`,
        inline: true,
      },
      {
        name: 'Length',
        value: formattedLength,
        inline: true,
      },
      {
        name: '',
        value: ppcalcSingleMod,
        inline: true,
      },
      {
        name: '',
        value: ppcalcDoubleMod,
        inline: true,
      },
      {
        name: '',
        value: ppcalcTriplePlusMod,
        inline: true,
      },
    ],
    image: {
      url: data.beatmapset.covers.cover,
    },
    footer: {
      text: `${data.beatmapset.favourite_count} Favorites • ${data.playcount} Playcounts • osu!${mode}`,
    },
  };

  return embed;
}

module.exports = {
  osuBeatmapInfoEmbeds
}
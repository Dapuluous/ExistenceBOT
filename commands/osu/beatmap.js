require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js');
const { getBeatmapInfo, getBeatmapPP, separateBeatmapModeAndID } = require('../../lib/components/components-osu');
const { osuBeatmapInfoEmbeds } = require('../../lib/embeds/osu/beatmap');
const { textConfirmation } = require('../../lib/components/components');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('beatmap')
    .setDescription('Get osu!beatmap info.')
    .addStringOption(option => option.setName('link')
      .setDescription('Beatmap link goes here')
      .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();

    // # Variables
    const beatmapLink = interaction.options.getString('link'); // Get beatmap's link from input
    let embedMsg, beatmapInfo, beatmapPP, linkSeparation; // Initiate empty variable

    try {
      linkSeparation = await separateBeatmapModeAndID(beatmapLink); // Separate mode and ID from the given url

      // # Get beatmap info, calculate their pp, and return those infos in an embed
      if (Array.isArray(linkSeparation)) {
        beatmapInfo = await getBeatmapInfo(linkSeparation[1]);
        beatmapPP = await getBeatmapPP(linkSeparation[0], linkSeparation[1]);
        embedMsg = await osuBeatmapInfoEmbeds(beatmapInfo, beatmapPP);
      } else {
        embedMsg = await textConfirmation("Invalid beatmap link", "danger");
      }
    } catch (e) {
      console.log(e);
      embedMsg = await textConfirmation("Something went wrong", "danger");
    }

    await interaction.editReply({ embeds: [embedMsg] });
  },
};
require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js');
const { getBeatmapInfo, getBeatmapPP, separateBeatmapModeAndID } = require('../../lib/osu/beatmap');
const { osuBeatmapInfoEmbeds } = require('../../lib/embeds/osu/beatmap');
const { textConfirmation } = require('../../lib/templates/textConfirmation');


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
    const linkSeparation = await separateBeatmapModeAndID(beatmapLink); // Separate mode and ID from the given url
    let embedMsg, beatmapInfo, beatmapPP; // Initiate empty variable

    try {
      // # Check if get beatmap function returns array or string
      if (Array.isArray(linkSeparation)) {
        // # get beatmap info, calculate their pp, and return those infos in an embed
        beatmapInfo = await getBeatmapInfo(linkSeparation[1]);
        beatmapPP = await getBeatmapPP(linkSeparation[0], linkSeparation[1]);
        embedMsg = await osuBeatmapInfoEmbeds(beatmapInfo, beatmapPP);
      } else {
        embedMsg = await textConfirmation("Invalid beatmap link", "danger");
      }
    } catch(e) {
      console.log(e);
      embedMsg = await textConfirmation("Something went wrong", "danger");
    }

    await interaction.editReply({ embeds: [embedMsg] });
  },
};
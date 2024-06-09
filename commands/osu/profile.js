const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const { getUserProfile } = require('../../lib/osu/user');
const { consoleLogText, textConfirmation } = require('../../lib/templates/components');
const { readFile } = require('../../lib/general/files');
const { userProfileEmbeds } = require('../../lib/embeds/osu/user');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("Get user's osu! profile")
    .addStringOption(option =>
      option.setName('mode')
        .setDescription("Choose user's gamemode")
        .setRequired(true)
        .addChoices(
          { name: 'osu!standard', value: 'osu' },
          { name: 'osu!taiko', value: 'taiko' },
          { name: 'osu!catch', value: 'fruits' },
          { name: 'osu!mania', value: 'mania' },
        ))
    .addStringOption(option => option.setName('nickname')
      .setDescription('Input osu! nickname (Optional)')),
  async execute(interaction) {
    await interaction.deferReply();

    // Variables
    const osuUserJSON = './storage/osuUser.json';
    const discordUserID = interaction.user.id;
    const nickname = interaction.options.getString('nickname');
    const userMode = interaction.options.getString('mode');
    let embedMsg, userProfile, osuJSONUserRead, osuUserID;

    try {
      if (nickname) {
        userProfile = await getUserProfile(nickname, userMode);
        embedMsg = await userProfileEmbeds(userProfile);
      } else {
        osuJSONUserRead = await readFile(osuUserJSON);
        osuUserID = osuJSONUserRead[discordUserID].id ?? null;

        if (osuUserID) {
          userProfile = await getUserProfile(osuUserID, userMode);
          embedMsg = await userProfileEmbeds(userProfile);
        } else {
          embedMsg = await textConfirmation("You haven't linked your osu! profile. Please use /set-osu first", "danger");
        }
      }
    } catch (error) {
      consoleLogText("error", `Error: ${error}`);
      embedMsg = await textConfirmation("Can't find any related users", "danger");
    }

    await interaction.editReply({ embeds: [embedMsg] });
  }
};
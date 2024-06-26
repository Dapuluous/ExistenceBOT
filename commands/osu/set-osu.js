const { SlashCommandBuilder } = require('discord.js');
const { getUserProfile, saveUserInformation } = require('../../lib/components/components-osu');
const { textConfirmation } = require('../../lib/components/components');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-osu')
    .setDescription("Link your osu! account to your Discord.")
    .addStringOption(option => option.setName('nickname')
      .setDescription('Your osu! nickname')
      .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    // Variables
    const nickname = interaction.options.getString('nickname'); // Get user's nickname input
    const discordUserID = interaction.user.id; // Get Discord user's ID
    let embedMsg;

    try {
      // Get user's info and save their id & nickname
      const userInfo = await getUserProfile(nickname, 'osu');

      if (userInfo.username == "null" || nickname == "null") {
        embedMsg = await textConfirmation("User not found", "danger");
      } else {
        const userID = userInfo.id;
        const userNickname = nickname == "null" ? "null" : userInfo.username;
        await saveUserInformation(userID, userNickname, discordUserID);
        embedMsg = await textConfirmation(`You have linked your osu! account **${nickname}**`, "primary");
      }
    } catch (e) {
      embedMsg = await textConfirmation("Something went wrong", "danger");
    }

    await interaction.editReply({ embeds: [embedMsg] });
  }
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Test your luck.'),
	async execute(interaction) {
        var generatedRoll = Math.floor(Math.random() * 100);
		await interaction.reply(`${interaction.user.username} rolls ${generatedRoll}`);
	},
};
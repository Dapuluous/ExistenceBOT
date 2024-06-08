const { Events } = require('discord.js');
const fs = require('fs');
var cron = require('node-cron');
// const { checkBirthday } = require('../lib/misc/birthday.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Read json config
		// let jsonData = JSON.parse(fs.readFileSync("lib/localdb/config.json"));

		// setInterval(async () => {
		// 	let birthday = await checkBirthday();

		// 	if (birthday != false) {
		// 		const channel = client.channels.cache.get(jsonData.birthdayAnnounceChannelID);
		// 		console.log("[Birthday] Somebody's having a birthday, sending them a warm message.");
		// 		await channel.send({ embeds: [birthday] });
		// 	} else {
		// 		console.log("[Birthday] Nobody's having a birthday now.");
		// 	}
		// }, 10000);

		// CRON: Check if today has somebody's birthday at 00:00 Asia/Jakarta Time
		// cron.schedule('0 0 * * *', async () => {
		// 	let birthday = await checkBirthday();

		// 	if(birthday != false) {
		// 		const channel = client.channels.cache.get(jsonData.birthdayAnnounceChannelID);
		// 		console.log("[Birthday] Somebody's having a birthday, sending them a warm message.");
		// 		await channel.send({ embeds: [birthday] });
		// 	} else {
		// 		console.log("[Birthday] Nobody's having a birthday now.");
		// 	}
		// }, {
		// 	scheduled: true,
		// 	timezone: "Asia/Jakarta"
		// });
	},
};
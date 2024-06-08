require('dotenv').config();
const axios = require('axios');
const {} = require('../const/url.js')

async function getTokenV2() {
    const data = new URLSearchParams({
		'client_id': process.env.OSU_CLIENT_ID,
		'client_secret': process.env.OSU_CLIENT_SECRET,
		'grant_type': 'client_credentials',
		'scope': 'public'
	});
	  
	const config = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

    const osuToken = await axios.post('https://osu.ppy.sh/oauth/token', data, config).then(response => {
		const accessToken = response.data.access_token
        return accessToken;
	}).catch(error => {
		console.error(error);
	});

	return osuToken;
}

module.exports = { getTokenV2 }
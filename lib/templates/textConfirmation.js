const { primaryColor, dangerColor, warningColor, osuColor } = require('../const/color.js');

async function textConfirmation(msg, type) {
  var noticeMsg = ':bulb: Notice';
  var warningMsg = ':warning: Warning';
  var errorMsg = ':anger: Error';
  var birthdayMsg = ':tada: Wake up! Somebody is having a birthday now!';

  var colorSet, msgSet;

  if (type == "primary") {
    colorSet = primaryColor;
    msgSet = noticeMsg;
  } else if (type == "warning") {
    colorSet = warningColor;
    msgSet = warningMsg;
  } else if (type == "danger") {
    colorSet = dangerColor;
    msgSet = errorMsg;
  } else if (type == "birthday") {
    colorSet = osuColor;
    msgSet = birthdayMsg;
  }

  const textEmbed = {
    color: colorSet,
    fields: [
      {
        name: msgSet,
        value: msg,
        inline: true,
      },
    ],
  };

  return textEmbed;
}

module.exports = { textConfirmation }
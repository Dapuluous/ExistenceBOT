async function convertGamemodeString(mode) {
  if (mode == "osu") {
    return "";
  } else if (mode == "fruits") {
    return "catch";
  } else {
    return mode;
  }
}

async function convertGamemodeToNumber(mode) {
  if (mode == "osu") {
    return 0;
  } else if (mode == "taiko") {
    return 1;
  } else if (mode == "fruits") {
    return 2;
  } else if (mode == "mania") {
    return 3;
  } else {
    return 0;
  }
}

module.exports = {
  convertGamemodeString,
  convertGamemodeToNumber
}
//Fetch JSON from given url
//function that Loops through the words and increment counter for each word, and adds word, counter to an object
//Take top 5 and write them to console along with their count value
//Write test case to validat. I'll use Mocha and Chai
//Re-create JSON in desired format. Couldn't figure out an easy way to fully build new object "in place". Will need to loop through in put again to complete

const fetch = require("node-fetch");
const util = require("util");

const getData = url => {
  return fetch(url)
    .then(res => res.json())
    .then(res => {
      print(res._embedded.episodes);
    })
    .catch(error => console.log(error));
};

// given original inout from api call, build object according to spec.
// there's definitely a better way to do this, but my initial thought was to split on '.'
// I should add '!, ?' and maybe others to the split.
// I know splitting on '.' isn't completely accurate since you can have things like "Mr. Davis"
// I was ging to add two counters and do some math after the loop is done to complete building this object (total duration, average episodes per season)
const buildObject = input => {
  let episodes = [];
  const TOTAL_EPISODES = input.length;
  let totalDuration = 0.0;
  let season = 1;
  input.map((item, mapId) => {
    let obj = {};
    let id = item.id;
    let shortT = item.name.split(": "); //need to split on : to get rid of title
    let shortSum = item.summary ? item.summary.split(".") : ""; //need to split on : to get rid of title
    shortSum = shortSum !== "" ? shortSum[0].replace(/<|p|>/gi, "") : "";
    //keep track of total seasons
    if (season != item.season) {
      season++;
    }
    // increment duration counter for this episode.
    totalDuration += item.runtime;
    obj[id] = {
      totalDurationSec: "", // Total duration of the show, across all episodes (seconds)
      averageEpisodesPerSeason: "", // Average episodes per season, float with max one decimal (e.g. 5.3)
      episodes: {
        TODO: {
          sequenceNumber: `s${item.season}e${item.number}`, // Episode and season number, e.g. "s1e1"
          shortTitle: `${shortT[1]}`, // Title without "Chapter XXX:" prefix
          airTimestamp: item.airstamp
            ? new Date(item.airstamp).getTime()
            : "N/A", // Air timestamp in epoch time (seconds)
          shortSummary: shortSum // First sentence of the summary, without HTML tags
        }
      }
    };
    episodes.push(obj);
  });
  //add total episodes in seconds. Assuming runtime is in minutes
  totalDuration = totalDuration * 60;

  console.log("======================================");
  console.log(" NEW OBJECT ARRAY ");
  console.log("======================================\n");
  console.log(util.inspect(episodes, false, null, true /* enable colors */));
  console.log("======================================");
  console.log(" END OF NEW OBJECT ARRAY ");
  console.log("======================================\n\n");
};

const url = `http://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes`;

const print = input => {
  let objArr = getFrequency(input);
  console.log("======================================");
  console.log(" FREQUENCY ARRAY ");
  console.log("======================================\n");
  console.log(util.inspect(objArr, false, null, true));
  console.log("======================================");
  console.log(" END OF FREQUENCY ARRAY ");
  console.log("======================================\n\n");
  buildObject(input);
};

// given the contents from api call, returns array of objects where key is the word and value it's frequency
// I split on space to get individual words. I used a replace all regex to get rid of the html tags
const getFrequency = input => {
  let arr = [];
  let wordCounts = {};
  input.map((item, id) => {
    if (item.summary) {
      let str = item.summary.replace(/<|>/gi, " ");
      var words = str.split(" ");
      for (var i = 0; i < words.length; i++) {
        let w = words[i].toLowerCase().replace(/[\W_]+/g, "");
        if (w !== "p" && w !== "") {
          if (wordCounts.hasOwnProperty(w)) {
            wordCounts[w] = wordCounts[w] + 1;
          } else {
            wordCounts[w] = 1;
          }
        }
      }
    }
  });

  arr.push(wordCounts);
  return arr;
};

getData(url);
//console.log(data);

module.exports = {
  getFrequency
};

// http://go-colly.org/articles/scraping_related_http_headers/
// https://developers.whatismybrowser.com/useragents/explore/operating_system_name/windows/

function randomAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

module.exports.randomAgent = randomAgent;

const userAgents = ["Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"];

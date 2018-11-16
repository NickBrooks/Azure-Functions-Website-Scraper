const metascraper = require("metascraper")([
  require("metascraper-youtube"),
  require("metascraper-amazon")(),
  require("metascraper-author")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-lang"),
  require("metascraper-lang-detector"),
  require("metascraper-logo")(),
  require("metascraper-clearbit-logo")(),
  require("metascraper-publisher")(),
  require("metascraper-title")(),
  require("metascraper-url")()
]);

async function scrapeWithMetaScraper(html, url) {
  const metadata = await metascraper({ html, url });
  return metadata;
}

module.exports.scrapeWithMetaScraper = scrapeWithMetaScraper;

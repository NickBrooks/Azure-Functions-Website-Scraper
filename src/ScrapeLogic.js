const request = require("request");
const azure = require("azure-storage");
const extractor = require("unfluff");
const sha256 = require("sha256");
const URL = require("url-parse");
const h2p = require("html2plaintext");
const moment = require("moment");
const { randomAgent } = require("./UserAgents");
const { scrapeWithMetaScraper } = require("./MetaScraper");

// initiate the table service
const tableService = azure.createTableService();
const scrapeTable = "scrapedlinks";
const entGen = azure.TableUtilities.entityGenerator;

function createTableIfNotExists() {
  tableService.createTableIfNotExists(scrapeTable, function(error) {
    if (error) {
      console.log(error);
    }
  });
}

function entityToResult(e, fetchText) {
  let entityResult = {
    ScrapedTime: e.Timestamp ? e.Timestamp._ : moment(Date.now()),
    InputUrl: e.InputUrl._,
    Url: e.Url._,
    Title: e.Title._,
    Description: e.Description._,
    Lang: e.Lang._,
    Image: e.Image._,
    Logo: e.Logo._,
    Date: e.Date ? e.Date._ : null,
    Tags: e.Tags._ ? e.Tags._.split(",") : [],
    Author: e.Author._,
    Publisher: e.Publisher._
  };

  if (fetchText) {
    entityResult.Text = e.Text._;
    entityResult.RawText = e.RawText._;
  }

  return entityResult;
}

async function getBodyHTML(url) {
  const params = {
    url,
    headers: {
      "User-Agent": randomAgent()
    }
  };

  return new Promise(resolve => {
    request(params, function(error, response, body) {
      resolve(body);
    });
  });
}

function getPartitionAndRowKeys(url) {
  const parsedUrl = new URL(url);
  if (!parsedUrl.origin) {
    return null;
  }

  const domain = parsedUrl.origin;
  const path = parsedUrl.pathname + parsedUrl.query + parsedUrl.hash;

  return {
    partitionKey: sha256(domain),
    rowKey: sha256(path ? path : "")
  };
}

async function getLinkFromTableStorage(partitionKey, rowKey, fetchText) {
  return new Promise(resolve => {
    createTableIfNotExists();
    tableService.retrieveEntity(scrapeTable, partitionKey, rowKey, function(
      error,
      result
    ) {
      if (!error) {
        resolve(entityToResult(result, fetchText));
      }

      resolve(null);
    });
  });
}

async function insertLinkIntoTableStorage(
  partitionKey,
  rowKey,
  url,
  responseData,
  fetchText
) {
  return new Promise(async resolve => {
    createTableIfNotExists();

    // scrape the html
    const scraped = extractor(responseData);
    const meta = await scrapeWithMetaScraper(responseData, url);
    const rawText = h2p(responseData);
    if (!meta.title) {
      resolve(null);
    }

    const newEntity = {
      PartitionKey: entGen.String(partitionKey),
      RowKey: entGen.String(rowKey),
      Title: entGen.String(meta.title ? meta.title.substring(0, 30000) : ""),
      Date: entGen.DateTime(moment(meta.date) ? moment(meta.date) : null),
      Author: entGen.String(meta.author ? meta.author : ""),
      Publisher: entGen.String(
        meta.publisher ? meta.publisher.substring(0, 30000) : ""
      ),
      Text: entGen.String(scraped.text ? scraped.text.substring(0, 30000) : ""),
      RawText: entGen.String(rawText ? rawText.substring(0, 30000) : ""),
      Image: entGen.String(
        meta.image && meta.image.length < 30000 ? meta.image : ""
      ),
      Logo: entGen.String(
        meta.logo && meta.logo.length < 30000 ? meta.logo : ""
      ),
      Tags: entGen.String(scraped.tags ? scraped.tags.join(",") : ""),
      Url: entGen.String(meta.url ? meta.url.substring(0, 30000) : ""),
      InputUrl: entGen.String(url.substring(0, 30000)),
      Lang: entGen.String(meta.lang ? meta.lang : ""),
      Description: entGen.String(
        meta.description ? meta.description.substring(0, 30000) : ""
      )
    };

    tableService.insertOrReplaceEntity(scrapeTable, newEntity, function(error) {
      if (!error) {
        resolve(entityToResult(newEntity, fetchText));
      }

      resolve(error);
    });
  });
}

module.exports.getBodyHTML = getBodyHTML;
module.exports.getLinkFromTableStorage = getLinkFromTableStorage;
module.exports.getPartitionAndRowKeys = getPartitionAndRowKeys;
module.exports.insertLinkIntoTableStorage = insertLinkIntoTableStorage;

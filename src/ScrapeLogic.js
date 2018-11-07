const request = require("request");
const azure = require("azure-storage");
const extractor = require("unfluff");
const sha256 = require("sha256");
const URL = require("url-parse");
const h2p = require("html2plaintext");
const moment = require("moment");
const { randomAgent } = require("./UserAgents");

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

function entityToResult(e) {
  return {
    ScrapedTime: e.Timestamp ? e.Timestamp._ : Date.now(),
    Link: e.Link._,
    CanonicalLink: e.CanonicalLink._,
    Title: e.Title._,
    SoftTitle: e.SoftTitle._,
    Description: e.Description._,
    Lang: e.Lang._,
    Favicon: e.Favicon._,
    Image: e.Image._,
    Date: e.Date ? e.Date._ : null,
    Copyright: e.Copyright._,
    Tags: e.Tags._ ? e.Tags._.split(",") : [],
    Author: e.Author._ ? e.Author._.split(",") : [],
    Publisher: e.Publisher._,
    Text: e.Text._,
    RawText: e.RawText._
  };
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

async function getLinkFromTableStorage(partitionKey, rowKey) {
  return new Promise(resolve => {
    createTableIfNotExists();
    tableService.retrieveEntity(scrapeTable, partitionKey, rowKey, function(
      error,
      result
    ) {
      if (!error) {
        resolve(entityToResult(result));
      }

      resolve(null);
    });
  });
}

async function insertLinkIntoTableStorage(
  partitionKey,
  rowKey,
  link,
  responseData
) {
  return new Promise(resolve => {
    createTableIfNotExists();

    // scrape the html
    const scraped = extractor(responseData);
    const rawText = h2p(responseData);
    if (!scraped.title && !scraped.softTitle && !text) {
      resolve(null);
    }

    const newEntity = {
      PartitionKey: entGen.String(partitionKey),
      RowKey: entGen.String(rowKey),
      Title: entGen.String(
        scraped.title ? scraped.title.substring(0, 60000) : ""
      ),
      SoftTitle: entGen.String(
        scraped.softTitle ? scraped.softTitle.substring(0, 60000) : ""
      ),
      Date: entGen.DateTime(moment(scraped.date) ? moment(scraped.date) : null),
      Author: entGen.String(scraped.author ? scraped.author.join(",") : ""),
      Copyright: entGen.String(
        scraped.copyright ? scraped.copyright.substring(0, 64000) : ""
      ),
      Publisher: entGen.String(
        scraped.publisher ? scraped.publisher.substring(0, 64000) : ""
      ),
      Text: entGen.String(scraped.text ? scraped.text.substring(0, 60000) : ""),
      RawText: entGen.String(rawText ? rawText.substring(0, 60000) : ""),
      Image: entGen.String(
        scraped.image && scraped.image.length < 60000 ? scraped.image : ""
      ),
      Tags: entGen.String(scraped.tags ? scraped.tags.join(",") : ""),
      CanonicalLink: entGen.String(
        scraped.canonicalLink ? scraped.canonicalLink.substring(0, 64000) : ""
      ),
      Link: entGen.String(link.substring(0, 64000)),
      Lang: entGen.String(scraped.lang ? scraped.lang : ""),
      Description: entGen.String(
        scraped.description ? scraped.description.substring(0, 64000) : ""
      ),
      Favicon: entGen.String(
        scraped.favicon && scraped.favicon.length < 60000 ? scraped.favicon : ""
      )
    };

    tableService.insertOrReplaceEntity(scrapeTable, newEntity, function(error) {
      if (!error) {
        resolve(entityToResult(newEntity));
      }

      resolve(error);
    });
  });
}

module.exports.getBodyHTML = getBodyHTML;
module.exports.getLinkFromTableStorage = getLinkFromTableStorage;
module.exports.getPartitionAndRowKeys = getPartitionAndRowKeys;
module.exports.insertLinkIntoTableStorage = insertLinkIntoTableStorage;

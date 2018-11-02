const axios = require("axios");
const azure = require("azure-storage");
const extractor = require("unfluff");
const sha256 = require("sha256");
const URL = require("url-parse");

// initiate the table service
const tableService = azure.createTableService();
const scrapeTable = "scrapedlinks";
const entGen = azure.TableUtilities.entityGenerator;

function getPartitionAndRowKeys(url) {
  const parsedUrl = new URL(url);

  return {
    partitionKey: sha256(parsedUrl.origin),
    rowKey: sha256(parsedUrl.pathname + parsedUrl.query + parsedUrl.hash)
  };
}

function createTableIfNotExists() {
  tableService.createTableIfNotExists(scrapeTable, function(error) {
    if (error) {
      console.log(error);
    }
  });
}

function entityToResult(e) {
  return {
    ScrapedTime: e.Timestamp._,
    Link: e.Link._,
    CanonicalLink: e.CanonicalLink._,
    Title: e.Title._,
    SoftTitle: e.SoftTitle._,
    Description: e.Description._,
    Lang: e.Lang._,
    Favicon: e.Favicon._,
    Image: e.Image._,
    Date: e.Date._,
    Copyright: e.Copyright._,
    Tags: e.Tags._ ? e.Tags._.split(",") : [],
    Author: e.Author._ ? e.TAuthorags._.split(",") : [],
    Publisher: e.Publisher._,
    Videos: e.Videos._ ? e.Videos._.split(",") : [],
    Text: e.Text._
  };
}

async function getLinkFromTableStorage(partitionKey, rowKey) {
  let promise = new Promise((resolve, reject) => {
    createTableIfNotExists();
    tableService.retrieveEntity(scrapeTable, partitionKey, rowKey, function(
      error,
      result
    ) {
      if (!error) {
        resolve(entityToResult(result));
      }

      reject(null);
    });
  });

  return await promise;
}

function insertLinkIntoTableStorage(partitionKey, rowKey, link, responseData) {
  try {
    createTableIfNotExists();

    // scrape the html
    const scraped = extractor(responseData);

    const newEntity = {
      PartitionKey: entGen.String(partitionKey),
      RowKey: entGen.String(rowKey),
      Title: entGen.String(
        scraped.title ? scraped.title.substring(0, 60000) : ""
      ),
      SoftTitle: entGen.String(
        scraped.softTitle ? scraped.softTitle.substring(0, 60000) : ""
      ),
      Date: entGen.DateTime(scraped.date),
      Author: entGen.String(scraped.author.join(",")),
      Copyright: entGen.String(
        scraped.copyright ? scraped.copyright.substring(0, 64000) : ""
      ),
      Publisher: entGen.String(
        scraped.publisher ? scraped.publisher.substring(0, 64000) : ""
      ),
      Text: entGen.String(scraped.text ? scraped.text.substring(0, 60000) : ""),
      Image: entGen.String(
        scraped.image && scraped.image.length < 60000 ? scraped.image : ""
      ),
      Tags: entGen.String(scraped.tags.join(",")),
      Videos: entGen.String(scraped.videos.join(",")),
      CanonicalLink: entGen.String(
        scraped.canonicalLink ? scraped.canonicalLink.substring(0, 64000) : ""
      ),
      Link: entGen.String(link.substring(0, 64000)),
      Lang: entGen.String(scraped.lang),
      Description: entGen.String(
        scraped.description ? scraped.description.substring(0, 64000) : ""
      ),
      Favicon: entGen.String(
        scraped.favicon && scraped.favicon.length < 60000 ? scraped.favicon : ""
      )
    };

    tableService.insertOrReplaceEntity(scrapeTable, newEntity, function(
      error,
      result
    ) {
      if (!error) {
        return result;
      }

      return null;
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = async function(context, req) {
  try {
    if (!req.body || !req.body.url) {
      context.res = {
        status: 400,
        body: "Please enter a URL"
      };
      return;
    }
    // get the partitionKey and rowKey
    const entityKeys = getPartitionAndRowKeys(req.body.url);

    // see if link exists first
    let tsLink = await getLinkFromTableStorage(
      entityKeys.partitionKey,
      entityKeys.rowKey
    );

    // and return if it does
    if (tsLink) {
      context.res = {
        body: tsLink,
        headers: {
          "Content-Type": "application/json"
        }
      };
      return;
    }

    // otherwise let's scrape
    let responseData = null;
    await axios.get(req.body.url).then(function(response) {
      responseData = response.data;
    });

    // no responseData
    if (!responseData) {
      context.res = {
        status: 400,
        body: "Error parsing URL."
      };
      return;
    }

    // add to table storage
    let newTsLink = insertLinkIntoTableStorage(
      entityKeys.partitionKey,
      entityKeys.rowKey,
      req.body.url,
      responseData
    );

    context.res = {
      body: newTsLink,
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error
    };
  }
};

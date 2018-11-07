const {
  getBodyHTML,
  getLinkFromTableStorage,
  getPartitionAndRowKeys,
  insertLinkIntoTableStorage,
  sanitizeUrl
} = require("./ScrapeLogic");

async function postRequest(req) {
  let scrapeResult = undefined;

  // check valid url been provided
  if (req.body && req.body.url) {
    const url = sanitizeUrl(req.body.url);
    // get the partitionKey and rowKey
    const entityKeys = url ? getPartitionAndRowKeys(url) : null;

    // begin
    if (entityKeys) {
      // see if link exists first, return if it does
      await getLinkFromTableStorage(
        entityKeys.partitionKey,
        entityKeys.rowKey
      ).then(async entity => {
        // if exists, let's return it
        if (entity) {
          scrapeResult = entity;
          // otherwise let's scrape
        } else {
          await getBodyHTML(url).then(async html => {
            if (html) {
              // add to table storage
              await insertLinkIntoTableStorage(
                entityKeys.partitionKey,
                entityKeys.rowKey,
                url,
                html
              ).then(entity => {
                if (entity) {
                  scrapeResult = entity;
                }
              });
            }
          });
        }
      });
    }
  }

  // success
  if (scrapeResult) {
    return {
      body: scrapeResult,
      headers: {
        "Content-Type": "application/json"
      }
    };
    // error
  } else {
    return {
      status: 400,
      body: {
        error:
          'Error parsing URL, provide a URL in the body: { url: "https://example.com/url"}'
      },
      headers: {
        "Content-Type": "application/json"
      }
    };
  }
}

module.exports.postRequest = postRequest;

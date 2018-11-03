const {
  getBodyHTML,
  getLinkFromTableStorage,
  getPartitionAndRowKeys,
  insertLinkIntoTableStorage
} = require("../src/ScrapeLogic");

module.exports = async function(context, req) {
  try {
    let scrapeResult = undefined;

    // check valid url been provided
    if (req.body && req.body.url) {
      // get the partitionKey and rowKey
      const entityKeys = getPartitionAndRowKeys(req.body.url);

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
            await getBodyHTML(req.body.url).then(async html => {
              if (html) {
                // add to table storage
                await insertLinkIntoTableStorage(
                  entityKeys.partitionKey,
                  entityKeys.rowKey,
                  req.body.url,
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
      context.res = {
        body: scrapeResult,
        headers: {
          "Content-Type": "application/json"
        }
      };
      // error
    } else {
      context.res = {
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
  } catch (error) {
    context.res = {
      status: 500,
      body: error
    };
  }
};

const aes256 = require("aes256");
const azure = require("azure-storage");
const tableService = azure.createTableService();
const tempKeysTable = "tempkeys";
const entGen = azure.TableUtilities.entityGenerator;

function createTableIfNotExists() {
  tableService.createTableIfNotExists(tempKeysTable, function(error) {
    if (error) {
      console.log(error);
    }
  });
}

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function insertTempKeyLog(decrypted) {
  const entity = {
    PartitionKey: entGen.String(decrypted),
    RowKey: entGen.String(makeid())
  };

  tableService.insertEntity(tempKeysTable, entity, function(error) {
    if (error) {
      console.log(error);
    }
  });
}

async function checkTempKeyLimit(tempKey) {
  return new Promise(resolve => {
    createTableIfNotExists();

    let query = new azure.TableQuery()
      .select(["partitionKey"])
      .top(10)
      .where("PartitionKey eq ?", tempKey);

    tableService.queryEntities(tempKeysTable, query, null, function(
      error,
      result
    ) {
      resolve(result.entries.length >= 10 ? false : true);
    });
  });
}

async function validate(req) {
  const tempKey = req.headers["x-temp-key"];
  if (!tempKey) {
    throw "Unauthorized";
  }

  const decrypted = aes256.decrypt(
    "LHGebvoencfCTprzeNwyGiT2ejJr8dSEAPTCK2QRjhbOkHl1PhfDLXGvlwyItBWL",
    req.headers["x-temp-key"]
  );

  if (!parseInt(decrypted) || !(await checkTempKeyLimit(decrypted))) {
    return false;
  } else {
    insertTempKeyLog(decrypted);
    return true;
  }
}

module.exports.validate = validate;

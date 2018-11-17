const aes256 = require("aes256");

function validate(req) {
  const tempKey = req.headers["x-temp-key"];
  if (!tempKey) {
    throw "Unauthorized";
  }

  const decrypted = aes256.decrypt(
    "LHGebvoencfCTprzeNwyGiT2ejJr8dSEAPTCK2QRjhbOkHl1PhfDLXGvlwyItBWL",
    req.headers["x-temp-key"]
  );

  if (!parseInt(decrypted)) {
    return false;
  }

  return true;
}

module.exports.validate = validate;

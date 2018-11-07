module.exports = async function(context) {
  context.log("JavaScript HTTP trigger function processed a request.");

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: { status: "I am alive." }
  };
};

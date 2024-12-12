const { TableServiceClient, TableClient, AzureNamedKeyCredential } 
  = require('@azure/data-tables');

// Replace these with your actual values
const accountName = "";
const accountKey = "";
const tableName = "";

// Create a credential using the account name and key
const credential = new AzureNamedKeyCredential(
  accountName, accountKey);

// Create a client to interact with the table
const client = new TableClient(`
  https://${accountName}.table.core.windows.net`, 
  tableName, 
  credential);


async function createTable(tableName) {
  try {
    const client = new TableServiceClient(
      `https://${accountName}.table.core.windows.net`, 
      credential
    )
    await client.createTable(tableName)
    return "success"
  } catch(e) {
    console.error(e)
    return "error"
  }
}

createTable("Messages")
  .then(res => console.log(res))
  .catch(e => console.error(e))

async function deleteItem(partitionKey) {
  /* 
   * Delete an entity from the tables 
   * @param {string} partitionKey - The partition key of the entity to delete
   * @returns {string} - A message indicating the result of the operation
   * */
  try {
    await client.deleteEntity(partitionKey, "")
    return "success"
  } catch(e) {
    console.error(e)
    return "error"
  }

}

/*
deleteItem("3")
  .then(res => console.log(res))
  .catch(e => console.error(e))
*/

async function main() {
    // List all entities in the table
    console.log("Fetching entities...");
    for await (const entity of client.listEntities()) {
        console.log(entity);
    }

    // Example of inserting a new entity
    const newEntity = {
        partitionKey: "3",
        rowKey: "",
        firstName: "John",
        lastName: "Doe",
    };

    await client.createEntity(newEntity);
    console.log("Entity created successfully!");
}

/*
main().catch((err) => {
    console.error("Error occurred:", err);
});

*/


const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');

// Replace these with your actual values
const accountName = "";
const accountKey = "";
const tableName = "";

// Create a credential using the account name and key
const credential = new AzureNamedKeyCredential(accountName, accountKey);

// Create a client to interact with the table
const client = new TableClient(`https://${accountName}.table.core.windows.net`, tableName, credential);

async function main() {
    // List all entities in the table
    console.log("Fetching entities...");
    for await (const entity of client.listEntities()) {
        console.log(entity);
    }

    // Example of inserting a new entity
    const newEntity = {
        partitionKey: "partition1",
        rowKey: "row1",
        myProperty: "some value"
    };

    //await client.createEntity(newEntity);
    console.log("Entity created successfully!");
}

main().catch((err) => {
    console.error("Error occurred:", err);
});


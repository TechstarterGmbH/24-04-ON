### Exercise: Create a Function App with Node.js that Saves Data into Azure Storage Tables

#### Step 1: Create and Configure Azure Function App

1. **Create a new Azure Function App:**
   - Use the Azure portal or Azure CLI to create a new Function App.
   - Choose Node.js as the runtime stack.

2. **Set Up Azure Storage Tables:**
   - Create an Azure Storage Account via the Azure portal or CLI.
   - Create a Table in the Storage Account.

#### Step 2: Develop and Deploy the Node.js Function

1. **Write the Node.js Function to Save Data:**

   - Create a new directory for your function app:
     ```sh
     mkdir MyFunctionApp
     cd MyFunctionApp
     ```

   - Initialize a new Node.js project and install necessary packages:
     ```sh
     npm init -y
     npm install @azure/storage-table
     ```

   - Create the function code in `index.js`:
     ```javascript
     const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

     module.exports = async function (context, req) {
         const account = process.env.STORAGE_ACCOUNT_NAME;
         const accountKey = process.env.STORAGE_ACCOUNT_KEY;
         const tableName = "MyTable";
         const credential = new AzureNamedKeyCredential(account, accountKey);
         const client = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);

         const data = {
             partitionKey: req.query.partitionKey || "defaultPartition",
             rowKey: req.query.rowKey || "defaultRow",
             data: req.query.data || "defaultData"
         };

         await client.createEntity(data);

         context.res = {
             status: 200,
             body: "Data saved to table storage"
         };
     };
     ```

   - Create a `local.settings.json` file for local development:
     ```json
     {
       "IsEncrypted": false,
       "Values": {
         "AzureWebJobsStorage": "UseDevelopmentStorage=true",
         "FUNCTIONS_WORKER_RUNTIME": "node",
         "STORAGE_ACCOUNT_NAME": "YourStorageAccountName",
         "STORAGE_ACCOUNT_KEY": "YourStorageAccountKey"
       }
     }
     ```

2. **Deploy the Function to Azure:**
   - Use the Azure CLI to deploy the function app:
     ```sh
     func azure functionapp publish <YourFunctionAppName>
     ```

3. **Test the Function:**
   - Send HTTP requests to your function app endpoint to verify it saves data correctly:
     ```sh
     curl "https://<YourFunctionAppName>.azurewebsites.net/api/<FunctionName>?partitionKey=testPartition&rowKey=testRow&data=testData"
     ```

### Additional Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Storage Tables Documentation](https://docs.microsoft.com/en-us/azure/storage/tables/)

These steps will guide you through creating an Azure Function App using Node.js that saves data into Azure Storage Tables. If you need further assistance, please let me know!

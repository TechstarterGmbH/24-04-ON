YHere’s the corrected step-by-step guide to hosting a static website on Azure Storage, including enabling the feature under the **Data Management** section:

### 1. **Create a Storage Account**
   - Go to the [Azure portal](https://portal.azure.com).
   - Click on **Create a resource** > **Storage** > **Storage account**.
   - Fill in the required fields (Subscription, Resource Group, Storage Account Name, Region) and click **Review + Create** to finalize.

### 2. **Enable Static Website Hosting**
   - After creating your storage account, go to the **Storage account** you just created.
   - Under **Data Management**, select **Static website**.
   - In the **Static website** settings, toggle **Enabled**.
   - Set the **Index document name** (e.g., `index.html`) and the **Error document path** (e.g., `404.html`).
   - Click **Save** to enable the static website feature.

### 3. **Upload Website Files**
   - In the **Storage account** dashboard, go to **Containers** under the **Data Management** section.
   - Click **+ Container** to create a new container. Set the access level to **Blob (anonymous read access)**.
   - After the container is created, upload your static website files (HTML, CSS, JS) into this container.

### 4. **Access Your Website**
   - Once your files are uploaded, go back to the **Static website** settings.
   - You'll see a **Primary web endpoint** URL (e.g., `http://<storage-account-name>.z6.web.core.windows.net`).
   - Visit this URL to access your live static website hosted on Azure.

### Key Notes:
- Make sure your container's access level is set to **Blob (anonymous read access)** for the files to be publicly accessible.
- You can link custom domains to this URL if needed.

With these steps, your static website should be successfully hosted on Azure Storage!

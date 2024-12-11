### Task Breakdown with Current Frame and Constraints  

1. **Build Infrastructure manually**  
2. **Implement Business Logic with Code**  
3. **Automate Infrastructure Deployments (Infrastructure as Code)**  

### Constraints  
- Use only the following Azure services:  
  - **Virtual Machines (VMs)** for compute tasks.  
  - **Function Apps** for serverless business logic.  
  - **Blob Storage** for unstructured data.  
  - **Queue Storage** for task queuing.  
  - **Table Storage** for structured data.  


### Scenario 1: Serverless Image Processing Pipeline
Your team works for a photography startup, PixelPerfect. The company wants to provide customers with resized images for social media. As part of the engineering team, you’ve been tasked with setting up a pipeline where users can upload images to a storage system, which will then be resized automatically and made available for download. The CTO expects a scalable and cost-effective serverless solution.

### Scenario 2: Task Queue with Azure Queue Storage
You’re part of a logistics company, QuickShip. The company needs a system to process incoming shipment requests. Each request is placed in a queue, and a background process handles them one by one to ensure no request is missed. Your manager has asked you to implement a system using Queue Storage and Function Apps to automate this task processing. You need to ensure it scales during peak hours when shipment requests flood in.

### Scenario 3: Scalable Web App Backend
Your client, BookBerry, is a startup building a book review platform. They need a backend system to store user profiles and reviews. The system must be lightweight and capable of scaling quickly with demand. The team decided to use a Function App for APIs and Table Storage for structured data storage. You’ve been tasked with implementing the backend, ensuring it's efficient and scalable.

### Scenario 4: Automating VM Maintenance
Your company, EcoCompute, is keen on reducing energy costs. They run a resource-heavy application on a VM that’s only needed during business hours. The IT team has asked you to implement a solution where the VM automatically starts at 8 AM and shuts down at 6 PM daily. Using a Function App and an ARM template, you’ll create and automate this process, showing the CFO how much money they’ll save.

### Scenario 5: Video Content Distribution System
You’re working with EduStream, an online learning platform that hosts thousands of instructional videos. To optimize storage and delivery, they want to store videos in Blob Storage and integrate a Function App that transcodes videos into multiple resolutions. Additionally, you’ll configure lifecycle management to archive older videos and set up a Content Delivery Network (CDN) to ensure fast global delivery.


const { QueueServiceClient } = require('@azure/storage-queue');
const connectionString = ""; // Replace with your actual connection string
const queueName = "";

async function main() {
  // Create a QueueServiceClient using the connection string
  const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);

  // Get a reference to the queue
  const queueClient = queueServiceClient.getQueueClient(queueName);

  // Create the queue if it does not exist
  await queueClient.createIfNotExists();

  console.log("Queue created (if not already existing).");

  // Send a message to the queue
  const messageText = "Hello, Azure Queue Storage!";
  const sendMessageResponse = await queueClient.sendMessage(messageText);
  console.log(`Sent message: ${messageText}, Message ID: ${sendMessageResponse.messageId}`);

  const { receivedMessageItems } = await queueClient.receiveMessages({ numberOfMessages: 32, visibilityTimeout: 10 });
  console.log(`Received messages: ${receivedMessageItems.length}`);

  /*
  // Receive and delete a message from the queue
  const receivedMessages = await queueClient.receiveMessages({ numberOfMessages: 1 });
  if (receivedMessages.length > 0) {
    const message = receivedMessages[0];
    console.log(`Received message: ${message.messageText}`);

    // Delete the message after processing it
    await queueClient.deleteMessage(message.messageId, message.popReceipt);
    console.log("Message deleted.");
  } else {
    console.log("No messages in the queue.");
  }
  */
}

main().catch((err) => {
  console.error("Error occurred:", err);
});

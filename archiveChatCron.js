const cron = require("cron");
const  Message  = require("./models/chat");
const  ArchivedChat = require("./models/archivedchats");

const archiveChatCron = new cron.CronJob("0 18 * * *", async () => {
    // Get all 1 day old messages
    const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
    const messages = await Message.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo
        }
      }
    });
  
    // Move messages to ArchivedChat table
    await ArchivedChat.bulkCreate(messages.map(message => ({
      id: message.id,
      message: message.message,
      userId: message.userId,
      groupId: message.groupId
    })));
  
    // Delete 1 day old messages from Message table
    await Message.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo
        }
      }
    });
  });
  
  archiveChatCron.start();
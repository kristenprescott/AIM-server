const { UserInputError, AuthenticationError } = require("apollo-server");

const { Message, User } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        // Make sure user is authenticated:
        if (!user) throw new AuthenticationError("Unauthenticated.");
        const otherUser = await User.findOne({
          where: { screenname: from },
        });
        if (!otherUser) throw new UserInputError("User not found.");
        const screennames = [user.screenname, otherUser.screenname];
        // SQL query that fetches from the messages table:
        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: screennames },
            to: { [Op.in]: screennames },
          },
          order: [["createdAt", "DESC"]],
        });
        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        // Make sure user is authenticated:
        if (!user) throw new AuthenticationError("Unauthenticated.");
        const recipient = await User.findOne({ where: { screenname: to } });
        if (!recipient) {
          throw new UseerInputError("User not found.");
        } else if (recipient.screenname === user.screenname) {
          throw new UserInputError("You can't message yourself.");
        }
        // Validate content:
        if (content.trim() === "") {
          throw new UseerInputError("Empty message.");
        }
        // Send message to recipient:
        const message = await Message.create({
          from: user.screenname,
          to,
          content,
        });
        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};

/*
mutation sendMessage{
  sendMessage(to: "JMack" content:"eyooooo what up Jay!" ){
    uuid
    from
    to
    content
    createdAt
  }
}
RES:
{
  "data": {
    "sendMessage": {
      "uuid": "0dc8aaaa-f29f-4c77-99fb-088e1be1c0af",
      "from": "aello",
      "to": "JMack",
      "content": "eyooooo what up Jay!",
      "createdAt": "1627437424066"
    }
  }
}
____________________________________________________
query getmessages{
  getMessages(from:"okaycorral"){
    uuid
    to
    from
    content
    createdAt
  }
}
RES:
{
  "data": {
    "getMessages": [
      {
        "uuid": "ec1616c3-cb4e-4718-bb80-e32954f9a947",
        "to": "gobabygogo",
        "from": "okaycorral",
        "content": "In person - wanna meet up for coffee and chat?",
        "createdAt": "2021-07-28T02:57:32.000Z"
      },
      {
        "uuid": "24517e50-80ff-4fd7-824d-2b1e346d60a0",
        "to": "okaycorral",
        "from": "gobabygogo",
        "content": "What is it wha happen",
        "createdAt": "2021-07-28T02:56:48.000Z"
      },
      {
        "uuid": "bae6e220-c6f3-47db-86f8-f7ee8b339ed1",
        "to": "gobabygogo",
        "from": "okaycorral",
        "content": "OMG. I have something to tell you...",
        "createdAt": "2021-07-28T02:56:08.000Z"
      }
    ]
  }
}
____________________________________________________

*/

# AIM Clone Backend

[Link to Frontend repo]()

---

Example Queries & Responses:

```
Query: getUsers:
REQ:
query{
  getUsers {
    screenname
    buddyInfo
    awayMessage
    bot
  }
}
RES:
{
  "data": {
    "getUsers": [
      {
        "screenname": "xusernamex",
        "buddyInfo": "",
        "awayMessage": "",
        "bot": false
      },
      {
        "screenname": "phillis",
        "buddyInfo": "Hello there! I'm Phyllis, I am 45 years old and I am recently divorced.",
        "awayMessage": "",
        "bot": false
      }
    ]
  }
}
____________________________________________________________
```

---

## Sequleize

`sequelize init` creates some boilerplate files for us:

`config.json` - database connection settings(dev, test, prod)
`models/index.js` - gets config.json and starts a new Sequelize instance and exports the package and DB instance
`migrations/` -
`seeders/` -

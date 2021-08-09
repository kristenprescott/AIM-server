# AIM Clone Backend

[Link to Frontend repo]()

---

## Example Queries & Responses:

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
Mutation: signUp:
REQ:
mutation($signUpScreenname: String!, $signUpPassword: String!, $signUpRole: String!) {
  signUp(screenname: $signUpScreenname, password: $signUpPassword, role: $signUpRole) {
    screenname role
  }
}
VARS:
{
  "signUpScreenname": "dogsweat",
  "signUpPassword": "lamppost",
  "signUpRole": "user"
}
RES:
{
  "data": {
    "signUp": {
      "screenname": "dogsweat",
      "role": "user"
    }
  }
}
```

---

## Sequleize

`sequelize init` creates some boilerplate files for us:

`config.json` - tells sequelize how to connect to our database & database connection settings(dev, test, prod)
`models` - contains all models, also contains an `index.js` file which integrates our all our models together and
`models/index.js` - gets config.json and starts a new Sequelize instance and exports the package and DB instance
`migrations/` - contains all migration files
`seeders/` - contains all seed files

```shell
aello@server::
------------------------------------------------------------
sequelize model:generate --name User --attributes screenname:string,buddyInfo:string

Sequelize CLI [Node: 16.5.0, CLI: 6.2.0, ORM: 6.6.5]

New model was created at /Users/aello/Documents/sandbox/AIMNT/server/models/user.js .
New migration was created at /Users/aello/Documents/sandbox/AIMNT/server/migrations/20210809051356-create-user.js .
aello@server::
------------------------------------------------------------

```

creates a User model in our database and `models/user.js` as well as `migrations/20210809051356-create-user` - migrations can create/add/remove cols change datatypes etc etc - they make changes to your database for you
**Note** `user.js` is lowercase - that is annoying.

In `models/User.js`(yeah I changed it) lets make some changes:

```diff
// ...
  User.init({
-    screenname: DataTypes.STRING,
+    screenname: {
+      type: DataTypes.STRING,
+      allowNull: false,
+      unique: true
+    },
     buddyInfo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
+   tableName: 'users'
  });
// ...
```

Now we need to update these User fields in migrations before we migrate to the db:

```js
// migrations.js
// ...
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      screenname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      buddyInfo: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
// ...
```

id, createdAt, and updatedAt were created for us - neat!

Now lets migrate:

```shell
aello@server::
------------------------------------------------------------
sequelize db:migrate

Sequelize CLI [Node: 16.5.0, CLI: 6.2.0, ORM: 6.6.5]

Loaded configuration file "config/config.json".
Using environment "development".
== 20210809051356-create-user: migrating =======
== 20210809051356-create-user: migrated (0.018s)

aello@server::
------------------------------------------------------------

```

... and here's what we've been doing in MySQLWorkbench so far:

```sql
CREATE DATABASE aim;
SHOW DATABASES;
DESCRIBE aim.users;
SELECT * FROM aim.users;
```

with that last command we can manually create some dummy userdata

Lets check in the command line:

```shell
aello@server::
------------------------------------------------------------
mysql -uroot -plamppost
# sign in to mysql
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 27
Server version: 8.0.23 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> use aim
# select aim database
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> SELECT * FROM users;
# show the users table
+----+------------+------------+---------------------+---------------------+
| id | screenname | buddyInfo  | createdAt           | updatedAt           |
+----+------------+------------+---------------------+---------------------+
|  1 | user1      | user1 info | 2021-08-08 01:36:00 | 2021-08-08 01:36:00 |
|  2 | user2      | user2 info | 2021-08-08 01:36:00 | 2021-08-08 01:36:00 |
+----+------------+------------+---------------------+---------------------+
2 rows in set (0.00 sec)

mysql> exit
Bye
aello@server::
------------------------------------------------------------

```

it worked. sweet.

Now we can change our `resolvers.js` `getUsers` function since we're fetching users from the DB:

```js
// Now fetching Users from database, so we import User model
const { User } = require("../models");

module.exports = resolvers = {
  Query: {
    getUsers: async () => {
      // Now that we're fetching Users from DB using async/await, we need a try/catch
      try {
        const users = await User.findAll();

        return users;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
```

---

We added some more fields to the users table, so we need to change our migration:

```shell
aello@server::
------------------------------------------------------------
sequelize db:migrate:undo
# Undo last migration (this will delete our users data)

Sequelize CLI [Node: 16.5.0, CLI: 6.2.0, ORM: 6.6.5]

Loaded configuration file "config/config.json".
Using environment "development".
== 20210809051356-create-user: reverting =======
== 20210809051356-create-user: reverted (0.014s)

aello@server::
------------------------------------------------------------
sequelize db:migrate
# Make our new migration

Sequelize CLI [Node: 16.5.0, CLI: 6.2.0, ORM: 6.6.5]

Loaded configuration file "config/config.json".
Using environment "development".
== 20210809051356-create-user: migrating =======
== 20210809051356-create-user: migrated (0.016s)

aello@server::
----
```

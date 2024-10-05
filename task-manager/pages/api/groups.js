// API endpoint for the management of user groups.

import { createRouter } from "next-connect";
import pool from "../../lib/db";

const router = createRouter();

// Gets a list of groups, each including their users and user roles.
// Returns an object of the format
/*
  [{
    id: 123
    name: "Group 1",
    users: [
      {
        id: 1
        username: "User1",
        role: "ADMIN"
      },
      {
        id: 1
        username: "User2",
        role: "MEMBER"
      }
    ]
  }]
*/
router.get(async (req, res) => {
  const { rows } = await pool.query(`
    SELECT 
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', g.group_id,
          'name', g.group_name,
          'users', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ug.user_id,
                'username', u.username,
                'role', ug.role
              )
            )
            FROM
              UserGroup ug
            JOIN
              Users u ON ug.user_id = u.user_id
            WHERE
              ug.group_id = g.group_id
          )
        )
      ) AS groups
    FROM
      Groups g
    WHERE
      ${req.query.userid} IN (
        SELECT DISTINCT ug.user_id
        FROM UserGroup ug
        WHERE ug.group_id = g.group_id
      )
    `);
  res.json(rows);
});

/* A post request to the API should contain a single group object (as detailed above), except the ID,
which will then be added to the groups database, alongside its included users.
*/
router.post(async (req, res) => {
  const group = req.body.group;
  await pool.query(`
    INSERT INTO Groups (group_name) VALUES
      ('${group.name}');
  `);

  group.users.forEach(async (user) => {
    await pool.query(`
      INSERT INTO UserGroup (user_id, group_id, role) VALUES 
        (
          ${user.id},
          (SELECT MAX(group_id) FROM Groups WHERE group_name = '${group.name}'),
          '${user.role}'
        );
    `);
  });

  res.status(201).end();
});

/* A put request should contain a group object as detailed above. The name of the group will be
changed in the database, if necessary, and the users in the group will be updated to match
the provided object. 
*/
router.put(async (req, res) => {
  const group = req.body.group;
  console.log(`
    UPDATE Groups
    SET group_name = '${group.name}'
    WHERE group_id = ${group.id};
  `);
  await pool.query(`
    UPDATE Groups
    SET group_name = '${group.name}'
    WHERE group_id = ${group.id};
  `);

  const newUsernames = group.users.map((user) => user.username);

  // delete all group users not in the put request
  console.log(`
    DELETE FROM UserGroup
    WHERE group_id = ${group.id}
      AND user_id NOT IN (
        SELECT user_id
        FROM Users
        WHERE username IN (${newUsernames.join(", ")})
      );
  `);
  await pool.query(`
    DELETE FROM UserGroup
    WHERE group_id = ${group.id}
      AND user_id NOT IN (
        SELECT user_id
        FROM Users
        WHERE username IN (${newUsernames.map(name => `'${name}'`).join(", ")})
      );
  `);

  // add all group users that were not already in database
  const { rows } = await pool.query(`
    SELECT u.username
    FROM UserGroup ug
    JOIN Users u ON ug.user_id = u.user_id
    WHERE ug.group_id = ${group.id}
  `);
  const currentUsernames = rows.map(row => row.username);
  console.log(currentUsernames);
  const newUsers = group.users.filter(
    (user) =>
      !currentUsernames.some((curUsername) => curUsername === user.username)
  );
  
  if (newUsers.length > 0) {
    console.log(`
      INSERT INTO UserGroup (user_id, group_id, role) VALUES
        ${newUsers
          .map(
            (user) =>
              `((SELECT MAX(user_id) FROM Users WHERE username = '${user.username}'), ${group.id}, '${user.role}')`
          )
          .join(",\n")};
    `);
    await pool.query(`
      INSERT INTO UserGroup (user_id, group_id, role) VALUES
        ${newUsers
          .map(
            (user) =>
              `((SELECT MAX(user_id) FROM Users WHERE username = '${user.username}'), ${group.id}, '${user.role}')`
          )
          .join(",\n")};
    `);
  }
  

  // update roles for existing users
  const existingUsers = group.users.filter((user) =>
    currentUsernames.some((curUsername) => curUsername === user.username)
  );

  existingUsers.forEach(async (user) => {
    await pool.query(`
      UPDATE UserGroup  
      SET role = '${user.role}'
      WHERE group_id = ${group.id}
        AND user_id = (SELECT MAX(user_id) FROM Users WHERE username = '${user.username}');
    `);
    console.log(`
      UPDATE UserGroup
      SET role = '${user.role}'
      WHERE group_id = ${group.id}
        AND user_id = (SELECT MAX(user_id) FROM Users WHERE username = '${user.username}');
    `);
  });

  res.status(201).end();
});

/* A delete request needs to contain a single group object. The group with this ID is deleted
from the database. 
*/
router.delete(async (req, res) => {
  console.log(JSON.stringify(req.body.group));
  await pool.query(`
    DELETE FROM Items
    WHERE group_id = ${req.body.group.id};
  `);
  await pool.query(`
    DELETE FROM UserGroup
    WHERE group_id = ${req.body.group.id};
  `);
  await pool.query(`
    DELETE FROM Groups
    WHERE group_id = ${req.body.group.id};
  `);
  res.status(201).end();
});

export default router.handler();

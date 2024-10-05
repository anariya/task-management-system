import { createRouter } from "next-connect";
import pool from "../../lib/db";

const router = createRouter();

router.get(async (req, res) => {
  // AI used to alter this to return empty items array when no items in column
  const { rows } = await pool.query(`SELECT 
    c.name, c.column_id,
    COALESCE(json_agg(
        json_build_object(
            'id', i.item_id,
            'title', i.title,
            'dueDate', TO_CHAR(i.due_date, 'YYYY-MM-DD'),
            'columnid', i.column_id,
            'columnIndex', i.column_index,
            'priority', i.priority,
            'itemIndex', i.itemindex,
            'assignedUsers', (
                SELECT json_agg(
                    json_build_object(
                        'id', ui.user_id,
                        'username', u.username
                    )
                )
                FROM UserItem ui
                  JOIN Users u ON u.user_id = ui.user_id
                WHERE ui.item_id = i.item_id
            )
        )
    ) FILTER (WHERE i.item_id IS NOT NULL), '[]') AS items
FROM 
    Columns c
LEFT JOIN 
    Items i ON c.column_id = i.column_id
WHERE
    c.group_id = ${req.query.groupid}
GROUP BY 
    c.name, c.column_id`);
  res.json(rows);
});

router.post(async (req, res) => {
  console.log(`INSERT INTO items (group_id, column_id, column_index, title, priority, itemIndex) VALUES
        (${req.body.groupid}, ${req.body.item.columnid}, ${req.body.item.columnIndex}, '${req.body.item.title}', 
            ${req.body.item.priority}, ${req.body.item.itemIndex})`);
  await pool.query(`INSERT INTO items (group_id, column_id, column_index, title, priority, itemindex) VALUES
    (${req.body.groupid}, ${req.body.item.columnid}, ${req.body.item.columnIndex},  '${req.body.item.title}', 
    ${req.body.item.priority}, ${req.body.item.itemIndex})`);
  res.status(201).end();
});

router.put(async (req, res) => {
  if (req.body.item.assignedUsers && req.body.item.assignedUsers.length === 0) {
    await pool.query(`DELETE FROM UserItem WHERE item_id = ${req.body.item.id}`);
  }

  if (req.body.item.assignedUsers && req.body.item.assignedUsers.length > 0) {
    const newUsernames = req.body.item.assignedUsers.map(
      (user) => user.username
    );

    // delete all assignees not in the new list
    console.log(`
      DELETE FROM UserItem
      WHERE item_id = ${req.body.item.id}
        AND user_id NOT IN (
          SELECT user_id
          FROM users
          WHERE username IN (${newUsernames.join(", ")})
        );
    `);
    await pool.query(`
      DELETE FROM UserItem
      WHERE item_id = ${req.body.item.id}
        AND user_id NOT IN (
          SELECT user_id
          FROM users
          WHERE username IN (${newUsernames
            .map((name) => `'${name}'`)
            .join(", ")})
        );
    `);

    // add all new assignees, as long as they're in the same group
    const { rows } = await pool.query(`
      SELECT u.username
      FROM UserItem ui
        JOIN Users u ON ui.user_id = u.user_id
      WHERE ui.item_id = ${req.body.item.id};
    `);
    const currentUsernames = rows.map((row) => row.username);
    // get all users in item's group
    console.log(`
      SELECT u.username
      FROM UserGroup ug
        JOIN Users u ON u.user_id = ug.user_id
      WHERE ug.group_id IN (SELECT MAX(i.group_id) FROM Items i WHERE i.item_id = ${req.body.item.id});
    `);
    const { rows: rowsGroup } = await pool.query(`
      SELECT u.username
      FROM UserGroup ug
        JOIN Users u ON u.user_id = ug.user_id
      WHERE ug.group_id IN (SELECT MAX(i.group_id) FROM Items i WHERE i.item_id = ${req.body.item.id});
    `);
    console.log(rowsGroup);
    const groupUsers = rowsGroup.map((row) => row.username);

    const newUsers = req.body.item.assignedUsers
      .filter(
        (user) =>
          !currentUsernames.some((curUsername) => curUsername === user.username)
      )
      .filter((user) =>
        groupUsers.some((curUsername) => curUsername === user.username)
      );

    if (newUsers.length > 0) {
      await pool.query(`
      INSERT INTO UserItem (user_id, item_id) VALUES 
        ${newUsers
          .map(
            (user) =>
              `((SELECT MAX(user_id) FROM Users WHERE username = '${user.username}'), ${req.body.item.id})`
          )
          .join(",\n")}
    `);
    }
  }

  console.log(`
        UPDATE items
        SET title = '${req.body.item.title}',
        column_id = ${req.body.item.columnid},
        column_index = ${req.body.item.columnIndex},
        itemindex = ${req.body.item.itemIndex},
        priority = ${req.body.item.priority},
        due_date = ${
          req.body.item.dueDate ? `'${req.body.item.dueDate}'` : "NULL"
        }
        WHERE item_id = ${req.body.item.id};
        `);
  await pool.query(`
        UPDATE items
        SET title = '${req.body.item.title}',
        column_id = ${req.body.item.columnid},
        column_index = ${req.body.item.columnIndex},
        itemindex = ${req.body.item.itemIndex},
        priority = ${req.body.item.priority},
        due_date = ${
          req.body.item.dueDate ? `'${req.body.item.dueDate}'` : "NULL"
        }
        WHERE item_id = ${req.body.item.id};
        `);
  res.status(201).end();
});

router.delete(async (req, res) => {
  await pool.query(`
        DELETE FROM items
        WHERE item_id = ${req.body.item.id}
        `);
  res.status(201).end();
});

export default router.handler();

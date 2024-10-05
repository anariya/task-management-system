import { createRouter } from 'next-connect';
import pool from '../../lib/db';

const router = createRouter();

// this api calls return example: 	[{"group_id" : 1, "role" : "ADMIN"}]

router.get(async (req, res) => {
    const { rows } = await pool.query(`
      SELECT json_agg(json_build_object('group_id', group_id, 'role', role)) AS groups
FROM usergroup
WHERE user_id = (SELECT id FROM Users WHERE username = '${req.body.username}');
      `);
    res.json(rows);
  })

export default router.handler();
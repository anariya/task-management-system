import { createRouter } from 'next-connect';
import pool from '../../lib/db';

const router = createRouter();

router.post(async (req, res) => {
    await pool.query(`INSERT INTO columns (column_id, group_id, name) 
        VALUES ((SELECT MAX(column_id) + 1 FROM columns), ${req.body.item.groupid}, '${req.body.item.name}')`)
    //await pool.query(`INSERT INTO items (group_id, column_id, column_index, itemIndex, priority, title) VALUES
    //    (${req.body.item.groupid}, (SELECT MAX(column_id) FROM columns), 0, -1, 0, 'Placeholder')`);
    //console.log(res)
    res.status(201).end();

});
router.put(async (req, res) => {
    console.log(req.body.column);
    console.log(`UPDATE columns
        SET name = '${req.body.column.name}'
        WHERE column_id = ${req.body.column.column_id};`);
    await pool.query(`
        UPDATE columns
        SET name = '${req.body.column.name}'
        WHERE column_id = ${req.body.column.column_id};`);
    res.status(201).end();
})

router.delete(async (req, res) => {
    await pool.query(`
            DELETE from items
            WHERE column_id = ${req.body.column.column_id};`);
    await pool.query(`
        DELETE from columns
        WHERE column_id = ${req.body.column.column_id};`);
    res.status(201).end();
})

export default router.handler();

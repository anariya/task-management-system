import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { groupId } = req.query;

    if (!groupId) {
      return res.status(400).json({ error: 'Missing groupId parameter' });
    }

    try {
      const eventsQuery = await pool.query(`
        SELECT event_id, group_id, name, start_date, end_date, location, 'true' AS editable
        FROM event
        WHERE group_id = $1
        UNION
        SELECT 0 AS event_id, group_id, CONCAT(title, ' due') AS name, due_date AS start_date, due_date AS end_date, '' AS location, 'false' AS editable
        FROM items
        WHERE group_id = $1
          AND due_date IS NOT NULL; 
        ;
      `, [groupId]);

      res.status(200).json(eventsQuery.rows);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  } else if (req.method === 'POST') {
    const { name, startDate, endDate, location, groupId } = req.body;
    console.log(req.body);

    if (!name || !startDate || !endDate || !groupId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const insertEventQuery = `
        INSERT INTO event (group_id, name, start_date, end_date, location)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

      const result = await pool.query(insertEventQuery, [groupId, name, startDate, endDate, location]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding new event:', error);
      res.status(500).json({ error: 'Failed to add new event' });
    }
  }  else if (req.method === 'PUT') {
    // Update an existing event
    const { eventId, name, startDate, endDate, location } = req.body;
    console.log(req.body);
  
    if (!eventId || !name || !startDate || !endDate) {
      console.error('Missing required fields in request body');
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const updateEventQuery = `
        UPDATE event
        SET name = $1, start_date = $2, end_date = $3, location = $4
        WHERE event_id = $5
        RETURNING *;
      `;
      const result = await pool.query(updateEventQuery, [name, startDate, endDate, location, eventId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }

  } else if (req.method === 'DELETE') {
    // Delete an event
    const { eventId } = req.body; // Assuming eventId is passed in the query parameters

    if (!eventId) {
      return res.status(400).json({ error: 'Missing eventId parameter' });
    }

    try {
      const deleteEventQuery = `
        DELETE FROM event
        WHERE event_id = $1
        RETURNING *;
      `;
      const result = await pool.query(deleteEventQuery, [eventId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }

  } else {
    // Method not allowed
    res.status(405).json({ error: 'Method not allowed' });
  }
}

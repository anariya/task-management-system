import { createRouter } from "next-connect";
import { google } from "googleapis";

const CLIENT_ID =
  "350480669789-ihtcgbfgtj619sgc5vna4nrt33ptq3ta.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "https://task-management-system-bt8s.onrender.com";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

const router = createRouter();

router.post(async (req, res) => {
  try {
    const { code, events, groupId } = req.body;
    console.log(`got code ${code}`);
    const token = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(token.tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await syncEvents(calendar, events, groupId);

    res.status(200);
  } catch (error) {
    const detailedError = error.response?.data || error.message || error;
    console.error(
      `Error: ${JSON.stringify(detailedError, null, 2)}`
    );
    res.status(500).json({ error: `failed` });
  }
});

const syncEvents = async (calendar, events, groupId) => {
  // get all currently existing events in calendar for this group
  const listRes = await calendar.events.list({
    calendarId: "primary",
    privateExtendedProperty: `groupId=${groupId}`,
  });

  // delete all currently existing events in calendar for this group
  if (listRes.items && listRes.items.length !== 0) {
    const ids = listRes.items.map(item => item.id);

    await ids.forEach(async id => {
      await calendar.events.delete({
        calendarId: "primary",
        eventId: id
      })
    });
  }

  // convert all new events to add to google calendar format
  const eventsToAdd = events.map(event => {
    return {
      id: `FIT3162TaskManager${event.id}`,
      summary: event.name,
      privateExtendedProperty: `groupId=${groupId}`,
      description: "Added by Task Manager",
      start: {
        dateTime: event.start_date,
      },
      end: {
        dateTime: event.end_date,
      },
      location: event.location
    };
  });

  // add new events to calendar
  await eventsToAdd.forEach(async event => {
    await calendar.events.insert({
      calendarId: "primary",
      requestBody: event
    });
  });
}

export default router.handler();

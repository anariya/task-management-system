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
    const { code } = req.body;
    console.log(`got code ${code}`);
    const token = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(token.tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      id: "189237",
      summary: "Test event",
      description: "Added by TaskManager",
      start: {
        date: "2024-10-14",
      },
      end: {
        date: "2024-10-14",
      },
    };

    const gcalRes = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.json(token);
  } catch (error) {
    const detailedError = error.response?.data || error.message || error;
    console.error(
      `OAuth token error: ${JSON.stringify(detailedError, null, 2)}`
    );
    res.status(500).json({ error: `failed` });
  }
});

export default router.handler();

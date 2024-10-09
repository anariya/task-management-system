import { createRouter } from "next-connect";
import { google } from "googleapis";

const CLIENT_ID = "350480669789-ihtcgbfgtj619sgc5vna4nrt33ptq3ta.apps.googleusercontent.com";
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
    res.json(token);
  } catch (error) {
    console.log(`oauth token error ${error}`);
    res.status(500).json({error: `failed`});
  }
});

export default router.handler();
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions/v1';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

export const generatePillInfo = functions.https.onCall(
  async (data: any, context) => {
    const { pillName, form, condition, ageGroup, timePreference } = data;

    if (typeof pillName !== 'string' || !pillName.trim()) {
      throw new functions.https.HttpsError('invalid-argument', 'Pill name is required and must be a non-empty string.');
    }

    const prompt = `
    You are a concise medical assistant.

    You MUST always return all of the following fields, no exceptions. 
    If uncertain, use reasonable defaults or write "Unspecified".

    Format exactly as:
    Dosage: ...
    Instructions: ...
    Frequency: ...
    Unit: ...
    WhenToTake: ...
    DaysToTake: ...
    ReminderTimes: ...

    Context:
    - Medication: ${pillName}
    - Form: ${form || 'Unspecified'}
    - Condition: ${condition || 'Unspecified'}
    - Age Group: ${ageGroup || 'Unspecified'}
    - Time Preference: ${timePreference || 'Unspecified'}`.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = completion.choices[0]?.message?.content ?? null;

    return { result };
  }
);

import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async generateSpeech(text: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly and helpfully: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return `data:audio/mp3;base64,${base64Audio}`;
      }
      return null;
    } catch (error) {
      console.error("Speech Generation Error:", error);
      return null;
    }
  },

  async askQuestion(question: string, subject: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert tutor in ${subject}. Answer the following student question clearly and concisely: ${question}`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm sorry, I couldn't process your question at the moment. Please try again later.";
    }
  },

  async validateTutor(details: any) {
    try {
      const prompt = `
        Validate if this person is qualified to be a tutor on TutorSphere (STEM/ICT platform).
        Details:
        - Education: ${details.education}
        - Subjects: ${details.subjects.join(", ")}
        - Level: ${details.teachingLevel}

        Rules:
        1. Must have at least a Degree or be in a relevant A/L stream (Maths/Science/ICT).
        2. Subjects must be STEM or ICT related.
        3. Teaching level must be appropriate for their education.

        Return ONLY a JSON object without any markdown formatting:
        {
          "isValid": boolean,
          "reason": "string explanation"
        }
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
        }
      });
      const text = response.text || '{"isValid": false, "reason": "Validation failed"}';
      return JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (error) {
      console.error("Validation Error:", error);
      return { isValid: false, reason: "System validation error" };
    }
  },

  async getChatbotResponse(message: string, context: string = "") {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are the TutorSphere Assistant. Help the user with their query. 
        Context: ${context}. 
        
        Special Instructions:
        1. If the user wants to take a quiz, mention that they can click the "Quizzes" tab or you can help them start one.
        2. If they ask for a tutor, recommend one based on the subject. 
        3. If they ask for a course, suggest a relevant one.
        4. If they ask about their progress, mention the "Skill Matrix" in their Dashboard.
        5. If they ask for a study plan, mention the "Adaptive Study Plan" in their Dashboard.
        6. Keep responses professional, helpful, and encouraging.
        
        User message: ${message}`,
      });
      return response.text;
    } catch (error) {
      return "I'm here to help! How can I assist you with TutorSphere today?";
    }
  },

  async generateStudyPlan(skillLevels: any[]) {
    try {
      const prompt = `
        Generate a personalized study plan for a student with these skill levels:
        ${JSON.stringify(skillLevels)}
        
        Return a JSON object:
        {
          "weeklyGoalHours": number,
          "recommendations": ["string"],
          "schedule": [{"day": "string", "topic": "string"}]
        }
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      return null;
    }
  },

  async generateQuiz(subject: string, level: string) {
    try {
      const prompt = `
        Generate a 5-question multiple choice quiz for ${subject} at ${level} level.
        Return a JSON object:
        {
          "questions": [
            {
              "question": "string",
              "options": ["string", "string", "string", "string"],
              "correctAnswer": number (0-3)
            }
          ]
        }
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      return null;
    }
  },

  async getSessionFeedback(subject: string, studentLevel: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide 3 personalized learning recommendations for a student studying ${subject} who is currently at ${studentLevel} level.`,
      });
      return response.text;
    } catch (error) {
      return "Keep practicing your fundamentals and focus on problem-solving.";
    }
  }
};

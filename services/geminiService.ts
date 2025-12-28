
import { GoogleGenAI, Type } from "@google/genai";
import { Channel, Message } from "../types";

export const processAgentCommand = async (
  userInput: string, 
  channels: Channel[], 
  history: Message[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const channelContext = channels.map(c => ({ 
    id: c.id, 
    name: c.name,
    genre: c.currentProgram.genres[0] || 'General'
  })).slice(0, 2000); 
  
  const systemInstruction = `You are the Nova Stream Pro Agent. Your purpose is to manage the user's IPTV broadcast node.
  
  AVAILABLE CHANNELS: ${JSON.stringify(channelContext)}
  
  CAPABILITIES:
  1. SELECT_CHANNEL: User wants a specific channel. Return the ID.
  2. CATEGORIZE: User wants to sort the playlist. Return category names.
  3. RECOVER: A channel is OFFLINE. Find the best possible alternative from the current playlist based on Name, Genre, or Numbering.
  
  OUTPUT FORMAT (Strict JSON):
  {
    "command": { 
      "type": "SELECT_CHANNEL" | "CATEGORIZE" | "RECOVER" | "NONE", 
      "value": string | string[] | null 
    },
    "response": "A professional, helpful response."
  }
  
  RECOVERY LOGIC:
  If a user says "This channel isn't working" or "Find a backup for X", analyze the list for similar names. 
  Example: If "CNN HD" is down, look for "CNN", "CNN International", or "News" channels.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Nova AI Logic Error:", error);
    return { 
      command: { type: "NONE", value: null },
      response: "Nova Core communication failure." 
    };
  }
};

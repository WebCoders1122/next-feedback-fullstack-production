// nextjs route to generate ai messages with vercel ai sdk

import { openai } from "@ai-sdk/openai";
import { streamText, StreamData } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const prompt2 =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const data = new StreamData();
    data.append({ test: "value" });

    const response = await streamText({
      model: openai("gpt-4-turbo"),
      maxTokens: 400,
      prompt: prompt2,
      onFinish() {
        data.close();
      },
    });
    console.log(response);
    return response.toAIStreamResponse({ data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

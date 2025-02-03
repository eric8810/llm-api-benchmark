import chalk from "chalk";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { TestResult } from "./types";

export async function streamOpenAIQuery(
  model: string = "gpt-3.5-turbo",
  baseUrl: string = "https://api.openai.com/v1",
  apiKey: string = process.env.OPENAI_API_KEY || "",
  messages: Array<ChatCompletionMessageParam> = [],
  temperature: number = 0.7
): Promise<TestResult> {
  try {
    console.log(chalk.blue("Starting query..."));
    const startTime = Date.now();
    let tftt = 0;
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseUrl,
    });

    const stream = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      stream: true,
      max_tokens: 8192,
    });

    let first = true;
    let fullResponse = "";
    let tokens = 0;
    for await (const chunk of stream) {
      if (first) {
        tftt = Date.now() - startTime;
        console.log(chalk.blue(`TFTT: ${tftt}ms`));
        first = false;
      }

      const content =
        chunk.choices[0]?.delta?.content ||
        (chunk.choices[0]?.delta as any)?.reasoning_content ||
        "";
      if (chunk.usage) {
        // console.log(chunk.usage);
        tokens = chunk.usage.completion_tokens;
      } else if (content) {
        tokens++;
      }
      fullResponse += content;
      const currentTime = Date.now() - startTime;

      process.stdout.write(
        `\r${chalk.gray(
          `[${currentTime}ms] Response Length: ${
            fullResponse.length
          }, Total Tokens: ${tokens}, Token/s: ${Math.round(
            tokens / (currentTime / 1000)
          )}`
        )}`
      );
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    const tokensPerSecond = Math.round(tokens / (duration / 1000));

    console.log("\n");
    console.log(`Time taken: ${duration}ms`);
    console.log(`Tokens: ${tokens}`);
    console.log(`Token/s: ${tokensPerSecond}`);

    return {
      tftt,
      duration,
      tokens,
      tokensPerSecond,
    };
  } catch (error) {
    console.error(chalk.red("Error:", error));
    throw error;
  }
}

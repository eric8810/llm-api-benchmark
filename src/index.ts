#!/usr/bin/env node

// Add this line at the top of the file to suppress the warning
process.removeAllListeners("warning");

import { Command } from "commander";
import chalk from "chalk";
import { ChatCompletionMessageParam } from "openai/resources";
import { streamOpenAIQuery } from "./llm";
import { TestResult } from "./types";

const DEFAULT_MESSAGES: Array<ChatCompletionMessageParam> = [
  {
    role: "system",
    content:
      "You are a helpful assistant that can answer questions and help with tasks.",
  },
  {
    role: "user",
    content:
      "Hello, write me a poem about a cat with 100 words, in shakespeare style",
  },
];

const REASONING_MESSAGES: Array<ChatCompletionMessageParam> = [
  {
    role: "system",
    content: `
      You are an AI assistant. You'll provide helpful, harmless, and detailed responses to all user inquiries. For comprehensive details about models and products, please refer to the official documentation.

      Key Guidelines:
      Identity & Compliance

      Clearly state your identity as a DeepSeek AI assistant in initial responses.

      Capability Scope

      Acknowledge limitations for real-time information post knowledge cutoff (2023-12)

      Provide technical explanations for AI-related questions when appropriate

      Response Quality

      Give comprehensive, logically structured answers

      Use markdown formatting for clear information organization

      Admit uncertainties for ambiguous queries

      Ethical Operation

      Strictly refuse requests involving illegal activities, violence, or explicit content

      Protect user privacy and avoid data collection

      Specialized Processing

      Use <think>...</think> tags for internal reasoning before responding

      Employ XML-like tags for structured output when required
      `,
  },
  {
    role: "user",
    content: "Hello, write me a poem about a cat",
  },
];

const program = new Command();

program
  .name("llm-api-benchmark")
  .description("Benchmark LLM APIs")
  .version("1.0.0");

program
  .command("run")
  .description("Run a benchmark test")
  .option("-m, --model <model>", "LLM model name to test")
  .option("-u, --url <url>", "LLM API url to test")
  .option("-k, --api-key <api-key>", "LLM API key to test")
  .option(
    "-t, --type <type>",
    "Type of model (chat, reason, completion)",
    "chat"
  )
  .option("-n, --iterations <number>", "Number of test iterations", "1")
  .action(async (options) => {
    console.log(chalk.blue("Starting benchmark..."));
    const iterations = parseInt(options.iterations);
    const results: TestResult[] = [];

    for (let i = 0; i < iterations; i++) {
      console.log(chalk.blue(`\nIteration ${i + 1}/${iterations}`));
      if (options.type === "reason") {
        console.log(chalk.blue("Starting reasoning test..."));
        try {
          const result = await streamOpenAIQuery(
            options.model,
            options.url,
            options.apiKey,
            REASONING_MESSAGES,
            0.7
          );
          results.push({ ...result });
        } catch (error) {
          console.error(chalk.red("Error:", error));
        }
      } else {
        console.log(chalk.blue("Starting chat test..."));
        try {
          const result = await streamOpenAIQuery(
            options.model,
            options.url,
            options.apiKey,
            DEFAULT_MESSAGES,
            0.7
          );
          results.push({ ...result });
        } catch (error) {
          console.error(chalk.red("Error:", error));
        }
      }
    }

    // Print aggregate statistics
    if (results.length > 0) {
      const avgTftt =
        results.reduce((acc, r) => acc + r.tftt, 0) / results.length;
      const avgDuration =
        results.reduce((acc, r) => acc + r.duration, 0) / results.length;
      const avgTokens =
        results.reduce((acc, r) => acc + r.tokens, 0) / results.length;
      const avgTokensPerSecond =
        results.reduce((acc, r) => acc + r.tokensPerSecond, 0) / results.length;

      console.log(chalk.green("\nAggregate Statistics:"));
      console.log(chalk.green(`Average TFTT: ${Math.round(avgTftt)}ms`));
      console.log(
        chalk.green(`Average Duration: ${Math.round(avgDuration)}ms`)
      );
      console.log(chalk.green(`Average Tokens: ${Math.round(avgTokens)}`));
      console.log(
        chalk.green(`Average Tokens/s: ${Math.round(avgTokensPerSecond)}`)
      );
    }
  });

program.parse(process.argv);

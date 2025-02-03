#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { ChatCompletionMessageParam } from "openai/resources";
import { streamOpenAIQuery } from "./llm";

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
  .action(async (options) => {
    console.log(chalk.blue("Starting benchmark..."));
    if (options.type === "reason") {
      console.log(chalk.blue("Starting reasoning test..."));
      try {
        await streamOpenAIQuery(
          options.model,
          options.url,
          options.apiKey,
          REASONING_MESSAGES,
          0.7
        );
      } catch (error) {
        console.error(chalk.red("Error:", error));
      }
    } else {
      console.log(chalk.blue("Starting chat test..."));
      streamOpenAIQuery(
        options.model,
        options.url,
        options.apiKey,
        DEFAULT_MESSAGES,
        0.7
      );
    }
  });

program.parse(process.argv);

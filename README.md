# LLM API Benchmark

A command-line tool for benchmarking various Large Language Model (LLM) APIs. This tool allows you to test different LLM models with standardized prompts to evaluate their performance and capabilities.

## Features

- Support for different LLM models and APIs
- Multiple testing modes:
  - Chat completion testing
  - Reasoning capability testing
- Configurable API endpoints and parameters
- Streaming response support
- Easy-to-use command-line interface

## Usage

Install and run directly using npx:

```bash
npx llmbench run [options]
```

### Options

- `-m, --model <model>`: Specify the LLM model name to test
- `-u, --url <url>`: Specify the LLM API URL to test
- `-k, --api-key <api-key>`: Provide the LLM API key
- `-t, --type <type>`: Choose the type of test (default: "chat")
  - Available types: "chat", "reason"

### Examples

1. Run a basic chat completion test:

```bash
npx llmbench run -m gpt-4 -u https://api.openai.com/v1 -k your-api-key
```

2. Run a reasoning capability test:

```bash
npx llmbench run -m gpt-4 -u https://api.openai.com/v1 -k your-api-key -t reason
```

## Test Types

### Chat Completion Test

The chat completion test uses a simple prompt asking for a Shakespeare-style poem about a cat. This test evaluates the basic generation capabilities of the model.

### Reasoning Test

The reasoning test uses a more complex system prompt that evaluates the model's ability to follow guidelines and provide structured responses while maintaining specific operational parameters.

## Development

### Local Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd llm-api-benchmark
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

This project is built with TypeScript and uses the following key dependencies:

- Commander.js for CLI interface
- OpenAI SDK for API interactions
- Chalk for colored console output

To contribute to the project:

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

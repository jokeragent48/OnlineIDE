# Online IDE Project

A web-based online compiler and IDE that supports multiple programming languages. This project consists of three main components:

1. **Frontend**: A Next.js application that provides the user interface
2. **Backend**: A Node.js API server that handles code compilation requests
3. **RabbitMQ Worker**: A worker service that processes compilation jobs asynchronously

## Project Structure

```
onlineide/
├── onlinecompilersBackend/    # Backend API server
│   ├── dist/                  # Compiled TypeScript files
│   ├── src/                   # Source code
│   ├── package.json
│   └── tsconfig.json
│
├── onlinecompilersfrontend/   # Next.js frontend application
│   ├── app/                   # Next.js app directory
│   ├── public/                # Static assets
│   ├── package.json
│   └── next.config.ts
│
└── RabbitMqWorker/            # Worker service for processing compilation jobs
    ├── index.js               # Worker entry point
    ├── worker.js              # Worker implementation
    ├── temp/                  # Temporary directory for code files
    └── package.json
```

## Prerequisites

- Node.js (v16 or higher)
- Docker
- npm or pnpm

## Setup and Installation

### 1. Start RabbitMQ with Docker

```bash
# Pull and run RabbitMQ in Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### 2. Setup and Start the RabbitMQ Worker

```bash
# Navigate to the worker directory
cd RabbitMqWorker

# Install dependencies
npm install

# Start the worker
node index.js
```

### 3. Setup and Start the Backend

```bash
# Navigate to the backend directory
cd onlinecompilersBackend

# Install dependencies
npm install

# Compile TypeScript to JavaScript
tsc -b

# Start the backend server
node dist/index.js
```

### 4. Setup and Start the Frontend

```bash
# Navigate to the frontend directory
cd onlinecompilersfrontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

Once all services are running:

1. Access the web interface at `http://localhost:3000`
2. Choose a programming language from the dropdown
3. Write or paste your code in the editor
4. Click "Run" to compile and execute your code
5. View the results in the output section


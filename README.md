# Project Setup

This project includes both a backend and a frontend. Follow the steps below to get everything running in development mode.

## 🚀 Backend Setup

### 1. Configure API Keys
Open `src/instrumentation.ts` and enter your API keys in the designated fields.

### 2. Create Environment File
Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Fill in all required values in the `.env` file according to your environment configuration.

### 3. Install Dependencies
From the root directory, install all required packages:

```bash
npm install
```

### 4. Start the Development Server
Launch the backend server in development mode:

```bash
npm run dev
```

## 🌐 Frontend Setup

### 1. Configure API Key
Open `frontend/tracer.ts` and enter your API key in the appropriate location.

### 2. Install Frontend Dependencies
Navigate to the frontend directory and install packages:

```bash
cd frontend
npm install
```

### 3. Start the Frontend Server
Launch the frontend development server:

```bash
npm run dev
```
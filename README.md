# Maps LLM Backend (Node.js + Ollama)

Backend service that combines **LLM (Ollama)** and **Google Maps API**
to find places based on natural language queries.

## 🚀 Features

-   Chat with LLM (local Ollama)
-   Detect location-related queries
-   Fetch places using Google Maps
-   OpenAPI compatible (Open WebUI ready)

## 🛠 Tech Stack

-   Node.js + Express
-   Ollama (llama3)
-   Google Maps Places API
-   Open WebUI (External Tools)

## 📦 Installation

```bash
git clone https://github.com/USERNAME/maps-llm-backend.git
cd maps-llm-backend
npm install
```

## ⚙️ Configuration

```bash
cp .env.example .env
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## ▶️ Run

```bash
npm run dev
```

## 🧠 Ollama Requirement

```bash
ollama pull llama3
ollama serve
```

## 🔌 Open WebUI Integration

-   URL: http://localhost:8000
-   OpenAPI Spec: /openapi.json
-   Auth: none

## Postman Collection

-   maps-llm-backend.postman_collection.json

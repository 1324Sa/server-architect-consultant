# 🚀 Server Infrastructure Architect Consultant AI

An end-to-end, privacy-focused, AI-powered system designed to analyze, architect, and visualize enterprise server infrastructures locally. Powered by high-performance local Large Language Models (**Qwen2.5-Coder:7b** / **Llama3.1:8b** via Ollama), this platform transforms complex organizational requirements into actionable, dynamic hardware specs, network topology diagrams, security protocols, and interactive 3D rack visualizations.

---

## 🌟 Key Features

- **🔒 100% On-Premise & Private AI**: Runs entirely offline via Ollama. No sensitive organizational data or network topologies ever leave your local network.
- **⚡ Dynamic Context-Aware Architecture Engine**: Unlike static templates, the backend dynamically calculates hardware specifications (CPU cores, RAM, NVMe storage) and security tiers based on company size, employee count, sensitivity level, and budget constraints.
- **📊 Real-time Mermaid.js Topologies**: Automatically generates interactive, custom network diagrams reflecting DMZs, Load Balancers, WAFs, and isolated database clusters.
- **🎮 Interactive 3D Server Viewer**: Built with **Three.js** / React Three Fiber to visualize server racks, status LEDs, and component positioning directly in the browser.
- **🛰️ Automated Infrastructure & Network Scanning**: Integrated IP geolocation lookup and network port scanning services to assess active endpoints.
- **🛡️ Robust AI Output Parsing**: Features multi-stage JSON regex sanitation and fallback mechanisms to ensure 100% uptime and prevent frontend parsing crashes.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [Next.js](https://nextjs.org/) (React, TypeScript)
- **Styling**: Tailwind CSS
- **Visualization**: [Three.js](https://threejs.org/) (3D Graphics), [Mermaid.js](https://mermaid.js.org/) (Diagrams)

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **AI / LLM Engine**: [Ollama](https://ollama.com/) running `qwen2.5-coder:7b` & `llama3.1:8b`
- **Networking**: `requests`, Python Socket API, IP Geolocation Services

---

## 📐 System Architecture

```mermaid
graph TD
    User([Client / Web Frontend]) -->|HTTP / JSON Requests| API[FastAPI Backend - main.py]
    
    subgraph Local Server Environment
        API -->|Network Ports Scan| NetScanner[Network Scanner Service]
        API -->|IP Lookup| GeoService[IP Geolocation Service]
        API -->|Custom System Prompt| Ollama[Ollama Local AI Runner]
        
        Ollama -->|LLM Inference| Model[qwen2.5-coder:7b / llama3.1:8b]
        Model -->|Structured JSON Response| Ollama
    end
    
    API -->|JSON Sanitization & Dynamic Diagram Generation| API
    API -->|Dynamic Spec + Mermaid Code + Geo Info| User
    
    subgraph Frontend Rendering
        User --> Render3D[Three.js 3D Rack Viewer]
        User --> RenderMermaid[Mermaid.js Topology Renderer]
    end



---
🚀 Quick Start Guide
Prerequisites
Node.js (v18+)

Python (v3.10+)

Ollama installed on your machine.

1. Model Setup (Ollama)
Ensure Ollama is running and pull the recommended model:

Bash
ollama pull qwen2.5-coder:7b
# OR
ollama pull llama3.1:8b
2. Backend Setup
Bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
3. Frontend Setup
Bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run Next.js development server
npm run dev
Open http://localhost:3000 in your browser to launch the consultant interface.
---
graph TD
    %% Frontend Layer
    subgraph Frontend_Tier ["📱 Front-End Tier (Next.js / React / TypeScript)"]
        UI["🖥️ User Interface (Dashboard & Forms)"]
        FormInput["📝 Input Data (IP, Company, Employees, Budget)"]
        Viewer3D["🎮 Three.js 3D Server Viewer"]
        MermaidRender["📊 Mermaid.js Topology Renderer"]
    end

    %% Backend Layer
    subgraph Backend_Tier ["⚙️ Back-End Tier (FastAPI / Python)"]
        API["🔌 FastAPI Engine (main.py)"]
        GeoService["🛰️ Location Service (IP Geolocation)"]
        NetScanner["🛡️ Network Scanner (Socket Port Scan)"]
        PromptBuilder["📝 System Prompt Builder"]
        Cleaner["🧹 Clean JSON & Regex Sanitizer"]
        FallbackEngine["⚡ Dynamic Fallback Logic"]
    end

    %% AI Engine Layer
    subgraph AI_Tier ["🤖 Local AI Engine (Ollama Local Runtime)"]
        OllamaServer["⚙️ Ollama Local Server (Port 11434)"]
        QwenModel["🧠 qwen2.5-coder:7b / llama3.1:8b"]
    end

    %% Data Flow Connections
    UI -->|1. User Inputs| FormInput
    FormInput -->|2. POST /api/consult| API
    
    API -->|3. Fetch IP Data| GeoService
    API -->|4. Scan Open Ports| NetScanner
    
    API -->|5. Build Prompt| PromptBuilder
    PromptBuilder -->|6. JSON Request| OllamaServer
    OllamaServer -->|7. Inference| QwenModel
    QwenModel -->|8. Raw Response| OllamaServer
    OllamaServer -->|9. Output Text| Cleaner
    
    Cleaner -->|10. Validated JSON| API
    API -.->|If Error / Fallback| FallbackEngine
    
    API -->|11. Final Structured Data| UI
    UI -->|12. Render Specs & Data| Viewer3D
    UI -->|13. Draw Topology Chart| MermaidRender
----

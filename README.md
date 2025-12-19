# 🏎️ RestAPI_BP

> A REST API for collecting, storing, and displaying sensor data from Formula racing cars

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Project Overview

This project is a REST API developed for **Formula Student / Formula 1–style racing cars** to handle real-time telemetry data. It simulates a real-world backend system that receives sensor data from vehicle components, processes it, stores it in a database, and provides readable outputs for analysis.

### What This API Does

In a Formula racing car, various sensors continuously generate data such as:
- 🌡️ Temperature readings
- ⚡ Speed and RPM
- 🔋 Voltage levels
- 📊 Other telemetry values

This REST API acts as a **backend service** that:
- ✅ Receives sensor data via HTTP requests
- ✅ Stores telemetry data in PostgreSQL database
- ✅ Provides API endpoints to retrieve and manage data
- ✅ Allows data visualization in table format for monitoring

---

## ✨ Features

- 🚀 **RESTful API** built with Node.js and Express
- 📡 Receives real-time data from vehicle sensors
- 💾 Stores telemetry data in PostgreSQL
- 🔧 Basic CRUD operations for sensor records
- ⚙️ Environment-based configuration using `.env`
- 📚 Designed as a backend internship portfolio project

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **PostgreSQL** | Database system |
| **npm** | Package manager |

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/kennerskk/RestAPI_BP.git
cd RestAPI_BP
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Environment configuration

Create a `.env` file in the project root:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

### 4️⃣ Prepare the database

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE your_db_name;
```

### 5️⃣ Start the server

```bash
npm run dev
```

The server will start on the port defined in your environment variables (default: `3000`).

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sensors` | Receive sensor data from the vehicle |
| `GET` | `/api/sensors` | Retrieve all stored sensor data |
| `GET` | `/api/sensors/:id` | Retrieve a specific sensor record by ID |
| `DELETE` | `/api/sensors/:id` | Delete a sensor record |

### Example Request Payload

```json
{
  "sensor_type": "engine_temperature",
  "value": 92.5,
  "unit": "celsius",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

###

# backend/Dockerfile
FROM python:3.14-slim

# Set working directory inside the container
WORKDIR /app

# Install system dependencies (needed for psycopg2 & friends)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better Docker layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# (Optional) If you use python-dotenv in main.py, it will pick up .env

# Expose FastAPI port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

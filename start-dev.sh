#!/bin/bash

# Start both backend and frontend for development

echo "Starting Electron Angular Authentication App..."
echo "========================================"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17+ to run the backend."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run the frontend."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven to build the backend."
    exit 1
fi

echo "✅ All dependencies are available"
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "   Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "   Frontend stopped"
    fi
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

echo "📦 Installing frontend dependencies..."
cd "$SCRIPT_DIR"
if ! npm install --silent; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "🏗️ Building backend..."
cd "$SCRIPT_DIR/backend"
if ! mvn clean compile -q; then
    echo "❌ Failed to build backend"
    exit 1
fi

echo "🚀 Starting backend server..."
cd "$SCRIPT_DIR/backend"
mvn spring-boot:run -q &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Check if backend is running
if ! curl -f http://localhost:8080/api/test/public >/dev/null 2>&1; then
    echo "⏳ Backend is still starting, waiting a bit more..."
    sleep 10
fi

if curl -f http://localhost:8080/api/test/public >/dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8080"
else
    echo "❌ Backend failed to start"
    cleanup
    exit 1
fi

echo "🚀 Starting frontend server..."
cd "$SCRIPT_DIR"
npm run start &
FRONTEND_PID=$!

echo ""
echo "🎉 Application is starting up!"
echo "================================"
echo "📱 Frontend: http://localhost:4200"
echo "🔧 Backend:  http://localhost:8080"
echo "🗄️ H2 Console: http://localhost:8080/api/h2-console"
echo ""
echo "💡 Tips:"
echo "   - Update OAuth2 credentials in backend/src/main/resources/application.properties"
echo "   - Use Ctrl+C to stop all services"
echo ""
echo "⏳ Waiting for frontend to start..."

# Wait for user to stop
wait $FRONTEND_PID
cleanup
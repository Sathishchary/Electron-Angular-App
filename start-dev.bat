@echo off
:: Start both backend and frontend for development on Windows

echo Starting Electron Angular Authentication App...
echo ========================================

:: Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java is not installed. Please install Java 17+ to run the backend.
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js to run the frontend.
    pause
    exit /b 1
)

:: Check if Maven is installed
mvn --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Maven is not installed. Please install Maven to build the backend.
    pause
    exit /b 1
)

echo ✅ All dependencies are available
echo.

echo 📦 Installing frontend dependencies...
call npm install --silent
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo 🏗️ Building backend...
cd backend
call mvn clean compile -q
if errorlevel 1 (
    echo ❌ Failed to build backend
    pause
    exit /b 1
)

echo 🚀 Starting backend server...
start "Backend Server" cmd /k "mvn spring-boot:run"

:: Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 15 /nobreak >nul

echo 🚀 Starting frontend server...
cd ..
start "Frontend Server" cmd /k "npm run start"

echo.
echo 🎉 Application is starting up!
echo ================================
echo 📱 Frontend: http://localhost:4200
echo 🔧 Backend:  http://localhost:8080
echo 🗄️ H2 Console: http://localhost:8080/api/h2-console
echo.
echo 💡 Tips:
echo    - Update OAuth2 credentials in backend/src/main/resources/application.properties
echo    - Close both command windows to stop all services
echo.
echo Press any key to exit this script...
pause >nul
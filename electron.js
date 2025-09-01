const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets/icon.png'), // Add icon if available
    title: 'Electron Angular Authentication App'
  });

  // In development, load from dev server; in production, load from built files
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    win.loadURL('http://localhost:4200');
    // Open DevTools in development
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, 'dist/Electron-Angualr-App/browser/index.html');
    win.loadFile(indexPath);
  }

  // Handle OAuth2 redirects
  win.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = url.parse(navigationUrl);
    
    // Allow navigation to OAuth2 providers
    if (parsedUrl.hostname === 'accounts.google.com' || 
        parsedUrl.hostname === 'api.instagram.com' ||
        parsedUrl.hostname === 'www.facebook.com') {
      // Open OAuth2 URLs in external browser
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Handle external links
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle app protocol for OAuth2 callbacks (optional enhancement)
  win.webContents.on('will-redirect', (event, navigationUrl) => {
    const parsedUrl = url.parse(navigationUrl, true);
    
    // Handle OAuth2 callback URLs
    if (parsedUrl.pathname === '/auth/callback') {
      // The callback is handled by the Angular app
      console.log('OAuth2 callback received:', navigationUrl);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    navigationEvent.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: __dirname + '/preload.js',
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  const menu = [
    {
      label: '文件',
      submenu: [{ role: 'quit', label: '退出' }]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
});

ipcMain.handle('set-time', async (event, filePath, newTime) => {
  return new Promise((resolve, reject) => {
    const cmd = `
    powershell -Command "
    $file = Get-Item '${filePath}';
    $date = Get-Date '${newTime}';
    $file.CreationTime = $date;
    $file.LastWriteTime = $date;
    $file.LastAccessTime = $date;
    "
    `;

    exec(cmd, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
});

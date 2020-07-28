/* eslint-disable import/no-extraneous-dependencies */
import {
  app, protocol, BrowserWindow, ipcMain,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import * as nodemailer from 'nodemailer';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

// Send Email
let transporter = null;
let mail = '';
let name = '';
let content = '';
ipcMain.on('emailInfo', (event, arg) => {
  if (transporter) {
    transporter = null;
  }
  const {
    account, password, type, nickName,
  } = arg;
  mail = account;
  name = nickName;
  transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    service: type,
    port: 465,
    secureConnection: true,
    auth: {
      user: account,
      pass: password,
    },
  });
  event.reply('finishCreate');
});

ipcMain.on('emailContent', (event, arg) => {
  if (content) {
    content = '';
  }
  content = arg;
  event.reply('finishContent');
});

ipcMain.on('sendEmail', (event, arg) => {
  if (!arg.length) return;
  const mailOptions = {
    from: `"${name}" <${mail}>`,
    to: arg,
    subject: 'hello',
    text: content,
  };

  // eslint-disable-next-line consistent-return
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    event.reply('finishSend', `Message sent: ${info.messageId}`);
  });
});

app.allowRendererProcessReuse = true;

import { app, BrowserWindow, globalShortcut } from "electron";
import { ipcMainHandle, isDev } from "./utils.js";
import {
  getStaticData,
  pollResources,
  preloadStaticData,
} from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

// NOTE: Hide the menu
// Menu.setApplicationMenu(null);

const staticDataPromise = preloadStaticData();

app.on("ready", async () => {
  await staticDataPromise;

  const mainWindow = new BrowserWindow({
    title: "Hardware Info",
    webPreferences: {
      preload: getPreloadPath(),
      backgroundThrottling: false,
    },
    // NOTE: Remove the default frame
    // frame: false
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123/");
  } else {
    mainWindow.loadFile(getUIPath());
    mainWindow.autoHideMenuBar = true;

    // Register a shortcut listener for Ctrl + Shift + I
    globalShortcut.register("Control+Shift+I", () => {
      // When the user presses Ctrl + Shift + I, this function will get called
      // You can modify this function to do other things, but if you just want
      // to disable the shortcut, you can just return false
      return false;
    });
  }

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", () => getStaticData());

  createTray(mainWindow);
  handleCloseEvents(mainWindow);
  createMenu(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();

    // For MacOS
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}

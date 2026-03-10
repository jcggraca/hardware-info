import { expect, Mock, test, vi } from "vitest";
import { createTray } from "./tray.js";
import { app, BrowserWindow, Menu } from "electron";

vi.mock("electron", () => {
  return {
    Tray: vi.fn(function () {
      return {
        setContextMenu: vi.fn(),
        on: vi.fn(),
      };
    }),
    app: {
      getAppPath: vi.fn().mockReturnValue("/"),
      quit: vi.fn(),
    },
    Menu: {
      buildFromTemplate: vi.fn(),
    },
  };
});

const mainWindow = {
  show: vi.fn(),
} satisfies Partial<BrowserWindow> as never as BrowserWindow;

test("", () => {
  createTray(mainWindow);

  const calls = (Menu.buildFromTemplate as never as Mock).mock.calls;
  const args = calls[0] as Parameters<typeof Menu.buildFromTemplate>;
  const template = args[0];
  expect(template).toHaveLength(2);

  expect(template[0].label).toEqual("Show");
  template[0]?.click?.(null as never, null as never, null as never);
  expect(mainWindow.show).toHaveBeenCalled();

  template[1]?.click?.(null as never, null as never, null as never);
  expect(app.quit).toHaveBeenCalled();
});

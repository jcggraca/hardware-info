import os from "os";
import fs from "fs";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "./utils.js";
import si from "systeminformation";

const POLLING_INTERVAL = 1000;

export function pollResources(mainWindow: BrowserWindow) {
  const poll = async () => {
    const [cpuLoad, cpuTemp, cpuSpeed, mem, battery] = await Promise.all([
      si.currentLoad(),
      si.cpuTemperature(),
      si.cpuCurrentSpeed(),
      si.mem(),
      si.battery(),
    ]);
    const storage = getStorageData();

    ipcWebContentsSend("statistics", mainWindow.webContents, {
      cpuUsage: cpuLoad.currentLoad,
      cpuTemp: cpuTemp.main,
      cpuSpeed: cpuSpeed.avg,
      ramUsage: (mem.used / mem.total) * 100,
      storageData: storage.usage,
      battery: {
        percent: battery.percent,
        charging: battery.isCharging,
        timeRemaining: battery.timeRemaining,
        hasBattery: battery.hasBattery,
      },
    });

    setTimeout(poll, POLLING_INTERVAL);
  };

  poll();
}

let cachedStaticData: StaticData | null = null;

export async function preloadStaticData() {
  const [cpuInfo, ramLayoutInfo, baseBoardInfo] = await Promise.all([
    si.cpu(),
    si.memLayout(),
    si.baseboard(),
  ]);

  cachedStaticData = {
    totalStorage: getStorageData().total,
    cpuModel: os.cpus()[0].model,
    cpu: {
      manufacturer: cpuInfo.manufacturer,
      brand: cpuInfo.brand,
      speed: cpuInfo.speed,
      cores: cpuInfo.cores,
      physicalCores: cpuInfo.physicalCores,
      processors: cpuInfo.processors,
    },
    ram: {
      slots: baseBoardInfo.memSlots,
      slotsUsed: ramLayoutInfo.length,
      formFactor: ramLayoutInfo[0]?.formFactor ?? "Unknown",
      speed: ramLayoutInfo[0]?.clockSpeed ?? 0,
      type: ramLayoutInfo[0]?.type ?? "Unknown",
      total: Math.round(os.totalmem() / 1024 ** 3),
    },
  };

  return cachedStaticData;
}

export function getStaticData(): StaticData {
  if (!cachedStaticData) {
    throw new Error("Static data not loaded yet");
  }

  return cachedStaticData;
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: Math.round((1 - free / total) * 100),
  };
}

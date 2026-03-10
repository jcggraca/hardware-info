type Statistics = {
  cpuUsage: number;
  cpuTemp: number;
  cpuSpeed: number;
  ramUsage: number;
  storageData: number;
  battery: {
    percent: number;
    charging: boolean;
    timeRemaining: number;
    hasBattery: boolean;
  };
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
    physicalCores: number;
    processors: number;
  };
  ram: {
    slots: number | null;
    slotsUsed: number;
    formFactor: string;
    speed: number | null;
    type: string;
    total: number;
  };
};

type View = "CPU" | "RAM" | "STORAGE" | "BATTERY";

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void,
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    subscribeView: (callback: (view: View) => void) => UnsubscribeFunction;
  };
}

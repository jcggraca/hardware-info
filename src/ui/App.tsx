import { useEffect, useMemo, useState } from 'react';
import Chart from './components/Chart/Chart';
import useStatistics from './hooks/useStatistics';
import Processor from './pages/Processor';
import Memory from './pages/Memory';
import useStaticData from './hooks/useStaticData';
import './App.css'
import Battery from './pages/Battery';

function App() {
  const staticData = useStaticData()
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>("CPU");

  const charts = useMemo(() => ({
    cpu: statistics.map(s => s.cpuUsage),
    ram: statistics.map(s => s.ramUsage),
    storage: statistics.map(s => s.storageData),
    battery: statistics.map(s => s.battery.percent)
  }), [statistics])

  useEffect(() => {
    const unsubscribe = window.electron.subscribeView(setActiveView);
    return unsubscribe;
  }, []);

  const hasBattery = statistics[statistics.length - 1]?.battery?.hasBattery

  return (
    <div className='main'>
      <div>
        <SelectOption view="CPU" onClick={() => setActiveView("CPU")} title='CPU' data={charts.cpu} />
        <SelectOption view="RAM" onClick={() => setActiveView("RAM")} title='RAM' data={charts.ram} />
        <SelectOption view="STORAGE" onClick={() => setActiveView("STORAGE")} title='STORAGE' data={charts.storage} />
        {hasBattery && <SelectOption view="BATTERY" onClick={() => setActiveView("BATTERY")} title='BATTERY' data={charts.battery} />}
      </div>
      <div className="mainGrid">
        {activeView === "CPU" && <Processor statistics={statistics} staticData={staticData} />}
        {activeView === "RAM" && <Memory statistics={statistics} staticData={staticData} />}
        {activeView === "BATTERY" && hasBattery && <Battery statistics={statistics} />}
      </div>
    </div>
  )
}

type SelectOptionProps = {
  title: string;
  view: View;
  data: number[];
  onClick: () => void;
}

function SelectOption({ title, view, data, onClick }: SelectOptionProps) {
  return <button onClick={onClick} className='selectOption'>
    <div className='selectOptionTitle'>
      {title}
    </div>
    <div className='selectOptionChart'><Chart height={2.5} selectedView={view} data={data} maxDataPoints={10} /></div>
  </button>
}

export default App

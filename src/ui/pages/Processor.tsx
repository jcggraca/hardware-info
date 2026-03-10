import { useMemo } from "react";
import LabeledValue from "../components/LabeledValue/LabeledValue";
import Paper from "../components/Paper/Paper";
import Chart from "../components/Chart/Chart";

type ProcessorProps = {
    statistics: Statistics[];
    staticData: StaticData | null;
}

export default function Processor({ statistics, staticData }: ProcessorProps) {
    const cpuUsages = useMemo(() => statistics.map((stat) => stat.cpuUsage), [statistics]);
    const title = `${staticData?.cpu.manufacturer} ${staticData?.cpu.brand}`
    const totalUsage = Math.round(cpuUsages[statistics.length - 1])
    const temp = statistics?.[statistics.length - 1]?.cpuTemp

    return (
        <>
            <div className='mainHeader'>
                <h1>{title}</h1>
                <span>Processor</span>
            </div>

            <section>
                <h2>Usage</h2>
                <Paper>
                    <Chart height={18} selectedView="CPU" data={cpuUsages} maxDataPoints={10} />
                    <LabeledValue label="Total Usage" value={`${totalUsage}%`} />
                </Paper>
            </section>

            <section>
                <h2>Properties</h2>
                <Paper>
                    <LabeledValue label="Current Speed" value={`${statistics?.[statistics.length - 1]?.cpuSpeed} GHz`} />
                    <hr />
                    {temp && (
                        <>
                            <LabeledValue label="Current Temperature" value={`${temp} °C`} />
                            <hr />
                        </>
                    )}
                    <LabeledValue label="Speed" value={staticData?.cpu.speed} />
                    <hr />
                    <LabeledValue label="Cores" value={staticData?.cpu.cores} />
                    <hr />
                    <LabeledValue label="Physical Cores" value={staticData?.cpu.physicalCores} />
                    <hr />
                    <LabeledValue label="Processors" value={staticData?.cpu.processors} />
                    <hr />
                </Paper>
            </section>
        </>
    )
}
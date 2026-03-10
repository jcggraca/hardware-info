import { useMemo } from "react";
import LabeledValue from "../components/LabeledValue/LabeledValue";
import Paper from "../components/Paper/Paper";
import Chart from "../components/Chart/Chart";

type MemoryProps = {
    statistics: Statistics[];
    staticData: StaticData | null;
}

export default function Memory({ statistics, staticData }: MemoryProps) {
    const ramUsages = useMemo(() => statistics.map((stat) => stat.ramUsage), [statistics]);
    const totalUsage = Math.round(ramUsages[statistics.length - 1])

    return (
        <>
            <div className='mainHeader'>
                <h1>Memory</h1>
                <span>{staticData?.ram.total} GB</span>
            </div>

            <section>
                <h2>Usage</h2>
                <Paper>
                    <Chart height={18} selectedView="RAM" data={ramUsages} maxDataPoints={10} />
                    <LabeledValue label="Total Usage" value={`${totalUsage}%`} />
                </Paper>
            </section>

            <section>
                <h2>Properties</h2>
                <Paper>
                    <LabeledValue label="Slots Used" value={`${staticData?.ram.slotsUsed} of ${staticData?.ram.slots}`} />
                    <hr />
                    <LabeledValue label="Speed" value={`${staticData?.ram.speed} MT/s`} />
                    <hr />
                    <LabeledValue label="Form Factor" value={staticData?.ram.formFactor ?? "Unknown"} />
                </Paper>
            </section>

        </>
    )
}
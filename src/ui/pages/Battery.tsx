import { useMemo } from "react";
import LabeledValue from "../components/LabeledValue/LabeledValue";
import Paper from "../components/Paper/Paper";
import Chart from "../components/Chart/Chart";

type BatteryProps = {
    statistics: Statistics[];
}

export default function Battery({ statistics }: BatteryProps) {
    const batteryUsages = useMemo(
        () => statistics.map((s) => s.battery?.percent ?? 0),
        [statistics]
    );

    const lastStat = statistics[statistics.length - 1];
    const battery = lastStat?.battery;
    const percent = battery?.percent ?? 0;
    const charging = battery?.charging ?? false;
    const timeRemaining = battery?.timeRemaining ?? "Unknown";
    const totalUsage = Math.round(percent);

    return (
        <>
            <div className='mainHeader'>
                <span>Battery</span>
            </div>

            <section>
                <h2>Usage</h2>
                <Paper>
                    <Chart
                        height={18}
                        selectedView="BATTERY"
                        data={batteryUsages}
                        maxDataPoints={10}
                    />
                    <LabeledValue label="Total Usage" value={`${totalUsage}%`} />
                </Paper>
            </section>

            <section>
                <h2>Properties</h2>
                <Paper>
                    <LabeledValue label="Battery" value={`${percent}%`} />
                    <hr />
                    <LabeledValue label="Charging" value={charging ? "Yes" : "No"} />
                    <hr />
                    <LabeledValue label="Time Remaining" value={timeRemaining} />
                </Paper>
            </section>
        </>
    );
}
import {useState, useEffect} from "react";

const TaskTimer = () => {
    const [isTiming, setIsTiming] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval;

        if (isTiming && startTime) {
            interval = setInterval(() => {
                const now = new Date();
                const secondsElapsed = Math.floor((now - startTime) / 1000);
                setElapsedTime(secondsElapsed);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isTiming, startTime]);

    const formatTime = (seconds = 0) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
    };

    const toggleTimer = () => {
        if (!isTiming) {
            setStartTime(new Date());
            setElapsedTime(0);
        } else {
            setStartTime(null);
        }
        setIsTiming(!isTiming);
    };

    return (
        <div className="flex justify-center gap-4">
            <button
                onClick={toggleTimer}
                className={`text-lime-400 font-mono text-lg px-4 py-2 rounded shadow-inner border border-gray-700 text-center transition duration-300 bg-gray-800`}
            >
                {isTiming ? "Stop" : "Start the timer"}
            </button>

            <div
                className={`
     bg-gray-800 text-lime-400 font-mono text-lg px-3 py-2 rounded shadow-inner border border-gray-700 text-center
    transition-all duration-300 ease-out
    ${isTiming ? "opacity-100 scale-100 delay-200 animate-pulse" : "hidden"}
  `}
            >
                {formatTime(elapsedTime)}
            </div>
        </div>

    );
};

export default TaskTimer;

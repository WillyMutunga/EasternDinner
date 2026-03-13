import { useState, useEffect } from 'react';
import './Countdown.css';

function Countdown({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="countdown-container">
            {Object.keys(timeLeft).length ? (
                Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="countdown-box">
                        <span className="countdown-value">{value < 10 ? `0${value}` : value}</span>
                        <span className="countdown-label">{unit}</span>
                    </div>
                ))
            ) : (
                <span className="countdown-expired">Event Started!</span>
            )}
        </div>
    );
}

export default Countdown;

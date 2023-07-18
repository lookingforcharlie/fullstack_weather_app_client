'use client';

import { Thermometer } from 'lucide-react';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { TCurrentWeather } from '../app/page';

interface CurrentWeatherProps {
  currentWeather: TCurrentWeather | undefined;
  saveCurrentWeather: () => Promise<void>;
  showCurrentWeather: (
    e: React.MouseEvent<HTMLButtonElement> | undefined
  ) => Promise<void>;
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
}

const CurrentWeather: FC<CurrentWeatherProps> = ({
  currentWeather,
  saveCurrentWeather,
  showCurrentWeather,
  isRunning,
  setIsRunning,
}) => {
  const [countdown, setCountdown] = useState(20);

  const handlePlayPause = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const handleSave = () => {
    saveCurrentWeather();
    setIsRunning(false);
    setCountdown(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      showCurrentWeather(undefined);
      console.log('Running showCurrentWeather function');
      setCountdown(20);
    }

    return () => {
      clearInterval(interval);
      // console.log('running clean-up function...');
    };
  }, [countdown, isRunning, showCurrentWeather]);

  return (
    <>
      {currentWeather && (
        <>
          <div className='border border-gray-500 flex flex-col px-16 py-6 gap-2 rounded-md shadow-md bg-slate-100'>
            <div className='font-semibold'>{currentWeather.cityName}</div>
            <div className='flex gap-4 items-center '>
              <Thermometer />
              <div>
                {/* render a space and celsius sign on the page */}
                {currentWeather.current_temperature}&nbsp;
                <span>&#8451;</span>
              </div>
            </div>
            <div className='mt-2 '>{currentWeather.local_time}</div>
            <button
              className='border border-slate-500 bg-slate-200 py-1 rounded-md mt-2 shadow-sm'
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          <div className='flex flex-col'>
            <h1>
              I will fetch the data in{' '}
              <span className='text-orange-600'>{countdown}</span>&nbsp;seconds.
            </h1>
            <button
              onClick={handlePlayPause}
              className='border border-slate-500 bg-slate-200 py-1 rounded-md mt-2 shadow-sm'
            >
              {isRunning ? 'Pause' : 'Go'}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default CurrentWeather;

// useEffect(() => {
//   let interval: NodeJS.Timeout;

//   if (isRunning && countdown > 0) {
//     interval = setInterval(() => {
//       if (countdown > 0) {
//         setCountdown((prevCountdown) => prevCountdown - 1);
//       } else if (countdown === 0) {
//         showCurrentWeather(undefined);
//         setCountdown(20);
//       }
//     }, 1000);
//   }

//   return () => {
//     clearInterval(interval);
//   };
// }, [countdown, isRunning, showCurrentWeather]);

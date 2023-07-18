'use client';
import {
  SearchCheck,
  Thermometer,
  ThermometerSnowflake,
  ThermometerSun,
} from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import CurrentWeather from '../components/CurrentWeather';
import { API_URL } from './config';

export type TSavedWeather = {
  _id: string;
  cityName: string;
  latitude: number;
  longitude: number;
  temperature: number;
  localTime: string;
  createDate: string;
  __v: number;
};

export type TCurrentWeather = {
  cityName: string;
  latitude: number;
  longitude: number;
  current_temperature: number;
  local_time: string;
};

export type THistoricalWeather = {
  cityName: string;
  maxTemperature: number;
  minTemperature: number;
  date: string;
};

export type TMessage = {
  message: string;
};

export default function Home() {
  const [indication, setIndication] = useState<string>(
    'Click the buttons to see the content'
  );
  const [cityName, setCityName] = useState<string>('');
  const [savedWeather, setSavedWeather] = useState<TSavedWeather[]>([]);
  const [currentWeather, setCurrentWeather] = useState<TCurrentWeather>();
  const [historicalWeather, setHistoricalWeather] =
    useState<THistoricalWeather[]>();
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
  };

  // show  the current weather of the input city
  const showCurrentWeather = async (
    e: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    if (e) {
      e.preventDefault();
    }
    setSavedWeather([]);
    setHistoricalWeather(undefined);
    setIndication('');
    try {
      const res = await fetch(`${API_URL}/getweather`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ cityName: cityName }),
      });
      const data: TCurrentWeather | TMessage = await res.json();
      if (res.status === 406) {
        setCurrentWeather(undefined);
        setIndication((data as TMessage).message);
        return;
      }
      setCurrentWeather(data as TCurrentWeather);

      console.log('Retrieved the weather data successfully');
    } catch (error) {
      console.log('We got problem: ', error);
    }
  };

  // Show 5-days historical weather temperature on the page
  const showHistoricalWeather = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setCurrentWeather(undefined);
    setSavedWeather([]);
    setIsRunning(false);
    setIndication('');
    const res = await fetch(`${API_URL}/gethistoricalweather`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ cityName: cityName }),
    });

    // destructuring the data sent from backend
    const {
      cityName: city,
      time,
      temperature_2m_max,
      temperature_2m_min,
    } = await res.json();

    // Prepare the Array of object I can use for rendering
    const weatherDataArray = [];
    for (let i = 0; i < time.length; i++) {
      const weatherData = {
        cityName: city,
        maxTemperature: temperature_2m_max[i],
        minTemperature: temperature_2m_min[i],
        date: time[i],
      };
      weatherDataArray.push(weatherData);
    }
    setHistoricalWeather(weatherDataArray);
    console.log(weatherDataArray);
  };

  // Save the current weather retrieved from API to MongoDB
  const saveCurrentWeather = async () => {
    const bodyObj = {
      cityName: currentWeather?.cityName,
      latitude: currentWeather?.latitude,
      longitude: currentWeather?.longitude,
      current_temperature: currentWeather?.current_temperature,
      local_time: currentWeather?.local_time,
    };
    const res = await fetch(`${API_URL}/saveweather`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(bodyObj),
    });
    const { message } = await res.json();
    console.log(message);
    setCurrentWeather(undefined);
    setIndication(message);
  };

  // Show the latest 5 weather data saved in MongoDB
  const showSavedData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentWeather(undefined);
    setHistoricalWeather(undefined);
    setIsRunning(false);
    setIndication('');
    setCityName('');
    const res = await fetch(`${API_URL}/saveweather`);
    const data: TSavedWeather[] = await res.json();
    setSavedWeather(data);
  };

  return (
    <main className='flex flex-col items-center justify-start h-screen px-12'>
      <div className=' border-orange-400  flex flex-col mt-12 w-full min-h-screen items-center justify-start gap-4'>
        {/* Input section starts */}
        <form className='flex flex-col items-center md:w-3/4 w-full mb-8'>
          <div className='flex items-center w-full'>
            <input
              type='text'
              value={cityName}
              className='w-full border-b border-gray-500 rounded-sm p-2 outline-none text-black placeholder:text-gray-400'
              placeholder='Enter the city name...'
              onChange={handleInput}
            />
            <div className='ml-[-25px] text-black'>
              <SearchCheck />
            </div>
          </div>
          {/* 3 buttons starts */}
          <div className='flex flex-col gap-3 mt-6'>
            <button
              className='border border-gray-500 px-4 py-2 rounded-md hover:shadow-md hover:bg-gray-100  disabled:text-gray-400 disabled:border-gray-300 disabled:pointer-events-none'
              type='submit'
              disabled={cityName.trim() === ''}
              onClick={(e) => showCurrentWeather(e)}
            >
              show current temperature in every minute
            </button>
            <button
              className='border border-gray-500 px-4 py-2 rounded-md hover:shadow-md hover:bg-gray-100  disabled:text-gray-400 disabled:border-gray-300 disabled:pointer-events-none'
              type='submit'
              disabled={cityName.trim() === ''}
              onClick={showHistoricalWeather}
            >
              show 5-day historical temperature
            </button>
            <button
              className='border border-gray-500 px-4 py-2 rounded-md hover:shadow-md hover:bg-gray-100'
              onClick={showSavedData}
            >
              show 5 recent saved data
            </button>
          </div>
          {/* 3 buttons ends */}
        </form>
        {/* Input section ends  */}

        {/* Current weather starts */}
        <CurrentWeather
          currentWeather={currentWeather}
          saveCurrentWeather={saveCurrentWeather}
          showCurrentWeather={showCurrentWeather}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
        />
        {/* Current weather ends */}

        {/* 5-Days Historical Weather starts */}
        <div className='grid grid-cols-2 gap-6 md:grid-cols-3 p-6 justify-items-stretch mx-auto'>
          {historicalWeather &&
            historicalWeather.map((item) => {
              return (
                <div
                  key={crypto.randomUUID()}
                  className='border border-gray-500 flex flex-col px-4 md:px-8 py-6 gap-2 rounded-md shadow-md bg-slate-100'
                >
                  <div>{item.cityName}</div>
                  <div className='flex gap-4 items-center '>
                    <ThermometerSun />
                    <div>
                      {/* render a space and celsius sign on the page */}
                      H&nbsp;&nbsp;
                      {item.maxTemperature}&nbsp;
                      <span>&#8451;</span>
                    </div>
                  </div>
                  <div className='flex gap-4 items-center '>
                    <ThermometerSnowflake />
                    <div>
                      {/* render a space and celsius sign on the page */}
                      L&nbsp;&nbsp;
                      {item.minTemperature}&nbsp;
                      <span>&#8451;</span>
                    </div>
                  </div>
                  <div className='mt-2 text-sm md:text-base'>{item.date}</div>
                </div>
              );
            })}
        </div>

        {/* 5-Days Historical Weather ends */}

        {/* 5 Saved weather data from MongoDB starts */}
        <div className='grid grid-cols-2 gap-6 md:grid-cols-3 mx-auto'>
          {savedWeather.length > 0 &&
            savedWeather.map((item) => {
              return (
                <div
                  key={item._id}
                  className='border border-gray-500 flex flex-col px-4 md:px-8 py-6 gap-2 rounded-md shadow-md bg-slate-100'
                >
                  <div>{item.cityName}</div>
                  <div className='flex gap-4 items-center '>
                    <Thermometer />
                    <div>
                      {/* render a space and celsius sign on the page */}
                      {item.temperature}&nbsp;
                      <span>&#8451;</span>
                    </div>
                  </div>
                  <div className='mt-2 text-sm md:text-base'>
                    {item.localTime}
                  </div>
                </div>
              );
            })}
        </div>
        {/* 5 Saved weather data from MongoDB ends */}
        <div>{indication}</div>
      </div>
    </main>
  );
}

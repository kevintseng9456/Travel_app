import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faCloudSun, faCloudRain, faSnowflake, faGlobe, faDollarSign, faExclamationTriangle, faUtensils, faPlane, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { Menu } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const MainPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [weather, setWeather] = useState({ temp: null, icon: faCloudSun });
  const { t, i18n } = useTranslation();
  const [selectedCurrency, setSelectedCurrency] = useState('TWD');
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [city, setCity] = useState(query || 'Taipei');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '简体中文' },
    { code: 'zh_TW', name: '繁體中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'es', name: 'Español' },
  ];

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  const getWeatherIcon = (description) => {
    if (description.includes('cloud')) {
      return faCloudSun;
    } else if (description.includes('rain') || description.includes('shower')) {
      return faCloudRain;
    } else if (description.includes('snow')) {
      return faSnowflake;
    } else {
      return faCloudSun; // default icon
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.post('http://localhost:3001/weather', {
        city: city
      });
      const data = response.data;
      const weatherIcon = getWeatherIcon(data.CurrentWeather.description.toLowerCase());
      setWeather({ temp: data.CurrentWeather.temp, icon: weatherIcon }); // 根據天氣資料設定圖示
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const handleChangeLanguage = (code) => {
    i18n.changeLanguage(code);
    setSelectedLang(code);
  };

  const handleChangeCurrency = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="relative h-screen bg-gray-100">
      {/* 遮罩 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleMenu}
        ></div>
      )}

      {/* 左側選單 */}
      <div
        className={`fixed top-0 left-0 w-64 bg-white shadow-lg h-full transform z-20 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300`}
      >
        <button onClick={toggleMenu} className="absolute top-4 right-4">
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <nav className="mt-16">
          <ul>
            <li className="p-4 hover:bg-gray-200">天氣資訊</li>
            <li className="p-4 hover:bg-gray-200">匯率</li>
            <li className="p-4 hover:bg-gray-200">旅遊警示</li>
            <li className="p-4 hover:bg-gray-200">當地文化介紹</li>
            <li className="p-4 hover:bg-gray-200">預算規劃</li>
            <li className="p-4 hover:bg-gray-200">交通規劃</li>
            <li className="p-4 hover:bg-gray-200">即時交通</li>
            <li className="p-4 hover:bg-gray-200">美食地圖</li>
            <li className="p-4 hover:bg-gray-200">體驗活動</li>
          </ul>
        </nav>
      </div>

      <header className="bg-[#0D1F2D] text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={toggleMenu} className="text-2xl">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">WANDERWAYS</h1>
            <p className="flex items-center justify-center">
              {city}
              <span className="ml-2 flex items-center">
                <FontAwesomeIcon icon={weather.icon} className="ml-2" />
                <span className="ml-1">{weather.temp}°C</span>
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-center w-full max-w-lg">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full p-4 rounded-lg border-2 border-gray-300 text-gray-900"
            value={city}
            onChange={handleCityChange}
          />
        </div>
        <div className="flex items-center space-x-4">
          <Menu as="div" className="relative inline-block text-left">
            <div className="w-32">
              <Menu.Button className="inline-flex justify-center px-4 py-2 bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
                <FontAwesomeIcon icon={faDollarSign} className="m-1" />
                {selectedCurrency}
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {['TWD', 'USD', 'EUR', 'JPY', 'CNY'].map((currency) => (
                  <Menu.Item key={currency}>
                    {({ active }) => (
                      <button
                        onClick={() => handleChangeCurrency(currency)}
                        className={`${
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        {currency}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </div>
          </Menu>
          <Menu as="div" className="relative inline-block text-left">
            <div className="w-32">
              <Menu.Button className="inline-flex justify-center px-4 py-2 bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
                <FontAwesomeIcon icon={faGlobe} className="m-1" />
                {languages.find((lang) => lang.code === selectedLang).name}
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {languages.map((lang) => (
                  <Menu.Item key={lang.code}>
                    {({ active }) => (
                      <button
                        onClick={() => handleChangeLanguage(lang.code)}
                        className={`${
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        {lang.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </div>
          </Menu>
        </div>
      </header>

      <main className="mt-4 p-4">
        <section>
          <h2 className="text-2xl font-bold mb-4">天氣資訊</h2>
          <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
            <FontAwesomeIcon icon={weather.icon} className="text-4xl" />
            <div className="ml-4">
              <p className="text-xl">{weather.temp}°C</p>
              <p>{city}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">匯率</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p>1 TWD = 0.03 USD</p>
            <p>1 TWD = 0.025 EUR</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">旅遊警示</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-2xl" />
            <p className="ml-2 inline">目前無旅遊警示。</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">當地文化介紹</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p>此地區擁有豐富的歷史和文化...</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">預算規劃</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p>建議的每日預算: 1000 TWD</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">交通規劃</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <FontAwesomeIcon icon={faPlane} className="text-blue-500 text-2xl" />
            <p className="ml-2 inline">最佳的交通方式為...</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">即時交通</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p>目前交通狀況良好。</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">美食地圖</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <FontAwesomeIcon icon={faUtensils} className="text-red-500 text-2xl" />
            <p className="ml-2 inline">推薦餐廳: ...</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">體驗活動</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <FontAwesomeIcon icon={faMapMarkedAlt} className="text-green-500 text-2xl" />
            <p className="ml-2 inline">當地的熱門活動包括...</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;

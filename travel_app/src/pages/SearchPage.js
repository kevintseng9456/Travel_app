import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Menu } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SearchBackground from '../components/SearchBackground';
import 'tailwindcss/tailwind.css';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '简体中文' },
  { code: 'zh_TW', name: '繁體中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'es', name: 'Español' },
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/main?query=${searchTerm}&lang=${selectedLang}`);
    }
  };

  const handleChangeLanguage = (code) => {
    i18n.changeLanguage(code);
    setSelectedLang(code);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-dark-gray text-white overflow-hidden">
      <SearchBackground />
      <div className="absolute top-4 right-4">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex justify-center w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <FontAwesomeIcon icon={faGlobe} className="m-1" />
            {languages.find((lang) => lang.code === selectedLang).name}
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-[#0D1F2D] dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-lg shadow-lg ring-4 ring-white ring-opacity-0.5 focus:outline-none">
            {languages.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => handleChangeLanguage(lang.code)}
                    className={`${
                      active ? 'bg-[#4a9d9c] text-white' : 'text-white dark:text-[#e0e0e0]'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    {lang.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </div>
      <div className="absolute flex flex-col items-center justify-center h-[20vh] w-[40vh] px-4">
        <motion.h1
          className="text-4xl font-semibold mb-4 shadow-text-lg aclonica-regular"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('title')}
        </motion.h1>
        <motion.div
          className="w-full max-w-md aldrich-regular"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="w-full p-4 rounded-lg border-2 border-search mb-4 text-gray-900"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;

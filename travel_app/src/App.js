import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import MainPage from './pages/MainPage';
import EarthCanvas from './components/Earthwheel';

const App = () => {

  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<SearchPage />} />
    //     <Route path="/main" element={<MainPage />} />
    //   </Routes>
    // </Router>
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full h-full">
        <EarthCanvas />
      </div>
    </div>
  );
};

export default App;

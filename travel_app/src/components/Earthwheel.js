// src/components/EarthWheel.js
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, MeshWobbleMaterial, OrbitControls, Text } from '@react-three/drei';
import { TextureLoader, Mesh, MeshBasicMaterial, ConeGeometry } from 'three';
import axios from 'axios';
import * as THREE from 'three';
import { XMLParser } from 'fast-xml-parser';
import StarBackground from './StarBackground';
import { motion } from 'framer-motion';
import { FaShareAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Earth = ({ rotationSpeed, highlightedLocation, clearHighlights, earthRadius, onRefChange }) => {
  const earthRef = useRef();
  const [highlightMeshes, setHighlightMeshes] = useState([]);
  const texture = useLoader(TextureLoader, process.env.PUBLIC_URL + '/imgs/8081_earthmap2k.jpg');

  useEffect(() => {
    if (earthRef.current) {
      onRefChange(earthRef);
    }
  }, [earthRef, onRefChange]);

  useEffect(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.offset.set(0.251, 0.005);
  }, [texture]);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      const deltaRotation = rotationSpeed * 0.01;
      earthRef.current.rotation.y += deltaRotation;
      earthRef.current.rotation.x += Math.sin(clock.getElapsedTime() * rotationSpeed * 0.5) * 0.0001;
    }
  });

  useEffect(() => {
    if (highlightedLocation) {
      highlightMeshes.forEach(mesh => earthRef.current.remove(mesh));
      setHighlightMeshes([]);

      const { coords } = highlightedLocation;
      const [longitude, latitude] = coords;

      const radius = earthRadius + 0.1;
      const height = 0.2;
      const radiusBottom = 0.04;
      const radialSegments = 50;

      const geometry = new ConeGeometry(radiusBottom, height, radialSegments, 1, false);
      const material = new MeshBasicMaterial({ color: '#00ff00' });
      const highlightMesh = new Mesh(geometry, material);

      const outerBallGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const outerBallMaterial = new MeshBasicMaterial({ color: '#00ff00', wireframe: false });
      const outerBallMesh = new Mesh(outerBallGeometry, outerBallMaterial);
      outerBallMesh.position.y = -height / 1.2;

      highlightMesh.add(outerBallMesh);
      const phi = (90 - longitude) * (Math.PI / 180);
      const theta = (latitude + 90) * (Math.PI / 180);

      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) - height / 50;
      const z = radius * Math.sin(phi) * Math.sin(theta);

      highlightMesh.position.set(x, y, z);

      const upVector = new THREE.Vector3(0, -1, 0);
      const worldPosition = new THREE.Vector3(x, y, z).normalize();
      highlightMesh.quaternion.setFromUnitVectors(upVector, worldPosition);

      earthRef.current.add(highlightMesh);
      setHighlightMeshes([highlightMesh]);

    } else if (clearHighlights) {
      highlightMeshes.forEach(mesh => earthRef.current.remove(mesh));
      setHighlightMeshes([]);
    }
  }, [highlightedLocation, clearHighlights]);

  return (
    <Sphere ref={earthRef} args={[earthRadius, 36, 36]}>
      <MeshWobbleMaterial
        attach="material"
        map={texture}
        roughness={0.6}
        metalness={0.1}
        factor={0}
        speed={0}
      />
    </Sphere>
  );
};

const EarthCanvas = () => {
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [highlightedLocation, setHighlightedLocation] = useState(null);
  const [clearHighlights, setClearHighlights] = useState(false);
  const [earthRadius, setEarthRadius] = useState(2.8);
  const [earthRef, setEarthRef] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prerotation, setPrerotation] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('全球');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showWinEffect, setShowWinEffect] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setEarthRadius(Math.min(width / 300, 2.8));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getRandomCoordinates = () => {
    let latitude, longitude;
    switch (selectedRegion) {
      case '亞洲':
        latitude = Math.random() * 75 - 10;
        longitude = Math.random() * 100 + 30;
        break;
      case '歐洲':
        latitude = Math.random() * 35 + 35;
        longitude = Math.random() * 60 - 10;
        break;
      case '北美洲':
        latitude = Math.random() * 60 + 15;
        longitude = Math.random() * 140 - 170;
        break;
      case '南美洲':
        latitude = Math.random() * 60 - 55;
        longitude = Math.random() * 80 - 80;
        break;
      case '非洲':
        latitude = Math.random() * 70 - 35;
        longitude = Math.random() * 70 - 20;
        break;
      case '大洋洲':
        latitude = Math.random() * 50 - 45;
        longitude = Math.random() * 65 + 110;
        break;
      default:
        latitude = Math.random() * 180 - 90;
        longitude = Math.random() * 360 - 180;
    }
    return { latitude, longitude };
  };

  const defaultLocations = {
    '亞洲': [
      { country: '中國', state: '北京' },
      { country: '日本', state: '東京' },
      { country: '韓國', state: '首爾' },
      { country: '印度', state: '新德里' },
      { country: '泰國', state: '曼谷' }
    ],
    '歐洲': [
      { country: '法國', state: '巴黎' },
      { country: '德國', state: '柏林' },
      { country: '英國', state: '倫敦' },
      { country: '意大利', state: '羅馬' },
      { country: '西班牙', state: '馬德里' }
    ],
    '北美洲': [
      { country: '美國', state: '紐約' },
      { country: '加拿大', state: '多倫多' },
      { country: '墨西哥', state: '墨西哥城' }
    ],
    '南美洲': [
      { country: '巴西', state: '聖保羅' },
      { country: '阿根廷', state: '布宜諾斯艾利斯' },
      { country: '智利', state: '聖地亞哥' }
    ],
    '非洲': [
      { country: '埃及', state: '開羅' },
      { country: '南非', state: '約翰內斯堡' },
      { country: '肯尼亞', state: '奈洛比' }
    ],
    '大洋洲': [
      { country: '澳大利亞', state: '悉尼' },
      { country: '新西蘭', state: '奧克蘭' }
    ],
    '全球': [
      { country: '美國', state: '紐約' },
      { country: '中國', state: '北京' },
      { country: '英國', state: '倫敦' },
      { country: '日本', state: '東京' },
      { country: '巴西', state: '聖保羅' }
    ]
  };

  const fetchLocationDetails = async (coords) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat: `${coords.latitude}`,
          lon: `${coords.longitude}`,
          format: 'json'
        }
      });

      if (response.data.address && response.data.address.country && response.data.address.state) {
        const result = response.data.address;
        const country = result.country;
        const state = result.state;

        if (isLocationInSelectedRegion(country)) {
          return { country, state };
        }
      }
      throw new Error('位置不在選定的區域內或無效');
    } catch (error) {
      console.error('獲取位置詳情時出錯:', error);
      throw error;
    }
  };

  const isLocationInSelectedRegion = (country) => {
    const regionCountries = {
      '亞洲': ['中國', '日本', '韓國', '印度', '泰國', '越南', '印尼', '馬來西亞', '新加坡', '菲律賓'],
      '歐洲': ['法國', '德國', '英國', '意大利', '西班牙', '荷蘭', '比利時', '瑞士', '奧地利', '瑞典'],
      '北美洲': ['美國', '加拿大', '墨西哥'],
      '南美洲': ['巴西', '阿根廷', '智利', '哥倫比亞', '秘魯'],
      '非洲': ['埃及', '南非', '肯尼亞', '奈及利亞', '摩洛哥'],
      '大洋洲': ['澳大利亞', '新西蘭', '斐濟', '巴布亞新幾內亞']
    };

    if (selectedRegion === '全球') return true;
    return regionCountries[selectedRegion].includes(country);
  };

  const isLocationVisible = (coords) => {
    let { longitude } = coords;
    if (longitude > 0) {
      longitude = longitude - 180;
    }
    const normalizedLongitudeDiff = (Math.abs(-earthRef.current.rotation.y * (180 / Math.PI) % 360 + longitude));
    earthRef.current.rotation.y -= prerotation;
    setPrerotation(earthRef.current.rotation.y);
    return normalizedLongitudeDiff;
  };

  const spinEarth = async () => {
    setIsSpinning(true);
    let locationDetails;
    let randomCoords;

    const initialSpeed = 5;
    const rotationDuration = 5;
    const angleAcceleration = -initialSpeed / rotationDuration;

    setRotationSpeed(initialSpeed);
    setClearHighlights(true);

    const startTime = performance.now();

    const fetchLocation = async () => {
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('獲取位置超時')), 3000)
      );

      try {
        do {
          randomCoords = getRandomCoordinates();
          const locationPromise = fetchLocationDetails(randomCoords);
          locationDetails = await Promise.race([locationPromise, timeout]);
          break;
        } while (true);
      } catch (error) {
        console.error('獲取位置失敗，使用預設位置');
        const defaultLocationsForRegion = defaultLocations[selectedRegion];
        locationDetails = defaultLocationsForRegion[Math.floor(Math.random() * defaultLocationsForRegion.length)];
      }
    };

    fetchLocation();

    const checkStopCondition = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;
      const currentSpeed = initialSpeed + angleAcceleration * elapsedTime;

      if (elapsedTime >= rotationDuration || currentSpeed <= 0) {
        setRotationSpeed(0);
        setHighlightedLocation({
          coords: [randomCoords.latitude, randomCoords.longitude],
          address: `${locationDetails.state}, ${locationDetails.country}`,
        });
        setIsSpinning(false);
        
        const rotationDiff = isLocationVisible(randomCoords);
        if (rotationDiff > 30 || 360 - rotationDiff > 30) {
          setRotationSpeed(0.5);
          const stopTime = rotationDiff > 180 ? 6200 - (rotationDiff - 180) * 20 : 3100 + rotationDiff * 20;
          setTimeout(() => {
            setRotationSpeed(0);
            setShowWinEffect(true);
            setTimeout(() => setShowWinEffect(false), 3000);
          }, stopTime);
        } else {
          setShowWinEffect(true);
          setTimeout(() => setShowWinEffect(false), 3000);
        }
      } else {
        setRotationSpeed(currentSpeed);
        requestAnimationFrame(checkStopCondition);
      }
    };

    checkStopCondition();
  };

  const shareResult = (platform) => {
    const shareUrl = `https://yourwebsite.com/earthwheel?location=${encodeURIComponent(highlightedLocation.address)}`;
    const shareText = `我在地球輪盤中抽中了 ${highlightedLocation.address}！來試試你的運氣吧！`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`);
        break;
      case 'instagram':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('分享文字已複製到剪貼簿，請貼上到 Instagram 貼文中。');
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-[100vh] text-white bg-gradient-to-b from-purple-900 to-indigo-900">
      {highlightedLocation && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 mt-3 px-4 py-2 text-2xl rounded font-bold tracking-wider bg-indigo-600 shadow-lg"
        >
          <p>{highlightedLocation.address}</p>
        </motion.div>
      )}
      <div className="relative w-full h-full max-h-screen">
        <Canvas className="w-full h-full">
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <StarBackground />
          <Earth 
            rotationSpeed={rotationSpeed} 
            highlightedLocation={highlightedLocation} 
            clearHighlights={clearHighlights} 
            earthRadius={earthRadius} 
            onRefChange={setEarthRef}
          />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Canvas>
        <motion.button
          className={`absolute bottom-8 left-[47%] transform -translate-x-1/2 px-6 py-3 ${
            isSpinning ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          } text-white text-xl font-bold rounded-full tracking-wider shadow-lg transition-all duration-300`}
          onClick={spinEarth}
          disabled={isSpinning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSpinning ? '旋轉中...' : '開始旋轉'}
        </motion.button>
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <select
            className="px-3 py-2 bg-indigo-600 text-white rounded-md shadow-lg"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="全球">全球</option>
            <option value="亞洲">亞洲</option>
            <option value="歐洲">歐洲</option>
            <option value="北美洲">北美洲</option>
            <option value="南美洲">南美洲</option>
            <option value="非洲">非洲</option>
            <option value="大洋洲">大洋洲</option>
          </select>
        </div>
        {highlightedLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4"
          >
            <button
              className="px-3 py-2 bg-green-500 text-white rounded-full shadow-lg flex items-center space-x-2"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <FaShareAlt />
              <span>分享</span>
            </button>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl p-2 flex space-x-2"
              >
                <button onClick={() => shareResult('facebook')} className="text-blue-600 hover:text-blue-800">
                  <FaFacebook size={24} />
                </button>
                <button onClick={() => shareResult('twitter')} className="text-blue-400 hover:text-blue-600">
                  <FaTwitter size={24} />
                </button>
                <button onClick={() => shareResult('instagram')} className="text-pink-600 hover:text-pink-800">
                  <FaInstagram size={24} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EarthCanvas;

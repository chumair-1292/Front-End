document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const weatherCard = document.getElementById('weatherCard');
  const cityInput = document.getElementById('cityInput');
  const searchBtn = document.getElementById('searchBtn');
  const suggestionsBox = document.getElementById('suggestionsBox');
  const suggestionsList = document.getElementById('suggestionsList');

  const temperature = document.getElementById('temperature');
  const conditionText = document.getElementById('conditionText');
  const cityName = document.getElementById('cityName');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('windSpeed');
  const weatherIcon = document.getElementById('weatherIcon');

  const messageBox = document.getElementById('messageBox');
  const messageText = document.getElementById('messageText');

  const canvas = document.getElementById('weatherCanvas');
  const ctx = canvas.getContext('2d');
  const lightningFlash = document.getElementById('lightningFlash');

  let debounceTimer;
  let animationFrameId;
  let particles = [];
  let currentEffect = 'sunny';

  // Resize canvas according to weather card
  const resizeCanvas = () => {
    canvas.width = weatherCard.clientWidth;
    canvas.height = weatherCard.clientHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Weather Condition Mapping & Theme Effects
  const getWeatherDetails = (code, isDay = 1) => {
    switch (code) {
      case 0:
        return {
          icon: isDay ? 'fa-sun' : 'fa-moon',
          text: 'Clear Sky',
          effect: 'sunny',
          themeClass: 'sunny'
        };
      case 1:
      case 2:
        return {
          icon: isDay ? 'fa-cloud-sun' : 'fa-cloud-moon',
          text: 'Partly Cloudy',
          effect: 'clouds',
          themeClass: 'sunny'
        };
      case 3:
        return {
          icon: 'fa-cloud',
          text: 'Overcast',
          effect: 'clouds',
          themeClass: 'cloudy'
        };
      case 45:
      case 48:
        return {
          icon: 'fa-smog',
          text: 'Foggy',
          effect: 'fog',
          themeClass: 'cloudy'
        };
      case 51: case 53: case 55:
      case 61: case 63: case 65:
      case 80: case 81: case 82:
        return {
          icon: 'fa-cloud-showers-heavy',
          text: 'Rainy',
          effect: 'rain',
          themeClass: 'rainy'
        };
      case 71: case 73: case 75: case 77: case 85: case 86:
        return {
          icon: 'fa-snowflake',
          text: 'Snowy',
          effect: 'snow',
          themeClass: 'snowy'
        };
      case 95: case 96: case 99:
        return {
          icon: 'fa-cloud-bolt',
          text: 'Thunderstorm',
          effect: 'thunder',
          themeClass: 'stormy'
        };
      default:
        return {
          icon: 'fa-cloud-sun',
          text: 'Clear',
          effect: 'sunny',
          themeClass: 'sunny'
        };
    }
  };

  // Canvas Real Particle Systems (Rain, Snow, Clouds, Fog)
  const initParticles = (type) => {
    particles = [];
    currentEffect = type;
    const count = type === 'rain' ? 80 : type === 'snow' ? 40 : type === 'thunder' ? 100 : 12;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 18 + 10,
        speedY: Math.random() * 8 + 4,
        speedX: Math.random() * 2 - 1,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        size: Math.random() * 40 + 20
      });
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentEffect === 'rain' || currentEffect === 'thunder') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      particles.forEach((p) => {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.speedX, p.y + p.length);
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });
      ctx.stroke();

      // Random Lightning Flash effect for Thunderstorm
      if (currentEffect === 'thunder' && Math.random() < 0.015) {
        lightningFlash.style.opacity = '0.8';
        setTimeout(() => { lightningFlash.style.opacity = '0'; }, 80);
      }

    } else if (currentEffect === 'snow') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      particles.forEach((p) => {
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        p.y += p.speedY * 0.3;
        p.x += Math.sin(p.y * 0.05) * 0.8;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });
      ctx.fill();

    } else if (currentEffect === 'clouds' || currentEffect === 'fog') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.x += 0.3;
        if (p.x - p.size > canvas.width) {
          p.x = -p.size;
        }
      });
    }

    animationFrameId = requestAnimationFrame(animateParticles);
  };

  const showMessage = (msg = 'invalid your country name') => {
    messageText.textContent = msg;
    messageBox.style.display = 'block';
    setTimeout(() => {
      messageBox.style.display = 'none';
    }, 3000);
  };

  const hideSuggestions = () => {
    suggestionsBox.style.display = 'none';
    suggestionsList.innerHTML = '';
  };

  // Fetch Weather Data by Latitude and Longitude
  const fetchWeatherByCoords = async (lat, lon, displayName) => {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
      const response = await fetch(weatherUrl);
      const data = await response.json();

      if (!data.current_weather) {
        showMessage('invalid your country name');
        return;
      }

      const temp = Math.round(data.current_weather.temperature);
      const wind = data.current_weather.windspeed;
      const weatherCode = data.current_weather.weathercode;
      const isDay = data.current_weather.is_day;

      let currentHumidity = 65;
      if (data.hourly && data.hourly.relativehumidity_2m) {
        currentHumidity = data.hourly.relativehumidity_2m[0];
      }

      // Details mapping
      const details = getWeatherDetails(weatherCode, isDay);

      // Update UI Text & Elements
      temperature.textContent = `${temp}°C`;
      conditionText.textContent = details.text;
      cityName.textContent = displayName;
      humidity.textContent = `${currentHumidity}%`;
      windSpeed.textContent = `${wind} km/h`;

      // Update Theme Class and Icon
      weatherCard.className = `weather-card ${details.themeClass}`;
      weatherIcon.className = `fa-solid ${details.icon} weather-graphic`;

      // Restart Visual Particles
      cancelAnimationFrame(animationFrameId);
      initParticles(details.effect);
      animateParticles();

      hideSuggestions();
      cityInput.value = '';

    } catch (err) {
      console.error(err);
      showMessage('invalid your country name');
    }
  };

  // Strict Search Functionality
  const performSearch = async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      showMessage('invalid your country name');
      return;
    }

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedQuery)}&count=10&language=en&format=json`;
      const response = await fetch(geoUrl);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        showMessage('invalid your country name');
        return;
      }

      // Check for exact matching full name
      const exactMatch = data.results.find(
        (item) =>
          item.name.toLowerCase() === trimmedQuery.toLowerCase() ||
          (item.country && item.country.toLowerCase() === trimmedQuery.toLowerCase())
      );

      if (exactMatch) {
        fetchWeatherByCoords(exactMatch.latitude, exactMatch.longitude, exactMatch.name);
      } else {
        showMessage('invalid your country name');
      }

    } catch (err) {
      console.error(err);
      showMessage('invalid your country name');
    }
  };

  // Auto-complete Live Suggestions while typing
  const fetchSuggestions = async (query) => {
    if (query.trim().length < 2) {
      hideSuggestions();
      return;
    }

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
      const response = await fetch(geoUrl);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        hideSuggestions();
        return;
      }

      suggestionsList.innerHTML = '';

      data.results.forEach((item) => {
        const li = document.createElement('li');
        
        // Element structure without spans
        const pTag = document.createElement('p');
        pTag.textContent = item.name;

        const smallTag = document.createElement('small');
        smallTag.textContent = item.country ? item.country : '';

        pTag.appendChild(smallTag);
        li.appendChild(pTag);

        li.addEventListener('click', () => {
          fetchWeatherByCoords(item.latitude, item.longitude, item.name);
        });

        suggestionsList.appendChild(li);
      });

      suggestionsBox.style.display = 'block';

    } catch (err) {
      console.error(err);
    }
  };

  // Input Typing Event
  cityInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchSuggestions(e.target.value);
    }, 300);
  });

  // Search Button Click
  searchBtn.addEventListener('click', () => {
    performSearch(cityInput.value);
  });

  // Enter Key Press
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(cityInput.value);
    }
  });

  // Hide Suggestions Box when clicked outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      hideSuggestions();
    }
  });

  // Default Load: Pakistan Weather
  fetchWeatherByCoords(30.3753, 69.3451, 'Pakistan');
});
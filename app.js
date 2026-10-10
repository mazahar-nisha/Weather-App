(function () {
    'use strict';

    const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

    const elements = {
        apiKey: document.getElementById('api-key'),
        toggleApiKey: document.getElementById('toggle-api-key'),
        city: document.getElementById('city'),
        country: document.getElementById('country'),
        getWeather: document.getElementById('get-weather'),
        errorSection: document.getElementById('error-section'),
        errorText: document.getElementById('error-text'),
        weatherSection: document.getElementById('weather-section'),
        loadingSection: document.getElementById('loading-section'),
        locationName: document.getElementById('location-name'),
        temperatureValue: document.getElementById('temperature-value'),
        weatherCondition: document.getElementById('weather-condition'),
        feelsLike: document.getElementById('feels-like'),
        humidity: document.getElementById('humidity'),
        pressure: document.getElementById('pressure'),
        windSpeed: document.getElementById('wind-speed'),
        sunrise: document.getElementById('sunrise'),
        sunset: document.getElementById('sunset')
    };

    let storedApiKey = '';

    function init() {
        loadStoredApiKey();
        bindEvents();
        updateButtonState();
    }

    function loadStoredApiKey() {
        try {
            const saved = localStorage.getItem('weatherly_api_key');
            if (saved) {
                storedApiKey = saved;
                elements.apiKey.value = saved;
            }
        } catch (e) {
            console.warn('Could not load API key from localStorage');
        }
    }

    function saveApiKey(key) {
        try {
            localStorage.setItem('weatherly_api_key', key);
            storedApiKey = key;
        } catch (e) {
            console.warn('Could not save API key to localStorage');
        }
    }

    function bindEvents() {
        elements.apiKey.addEventListener('input', handleApiKeyInput);
        elements.toggleApiKey.addEventListener('click', toggleApiKeyVisibility);
        elements.city.addEventListener('input', updateButtonState);
        elements.country.addEventListener('input', updateButtonState);
        elements.getWeather.addEventListener('click', handleGetWeather);

        elements.city.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleGetWeather();
        });
        elements.country.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleGetWeather();
        });
    }

    function handleApiKeyInput() {
        const key = elements.apiKey.value.trim();
        saveApiKey(key);
        updateButtonState();
    }

    function toggleApiKeyVisibility() {
        const type = elements.apiKey.type === 'password' ? 'text' : 'password';
        elements.apiKey.type = type;

        const eyeIcon = elements.toggleApiKey.querySelector('.icon-eye');
        const eyeOffIcon = elements.toggleApiKey.querySelector('.icon-eye-off');

        if (type === 'text') {
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
        } else {
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
        }
    }

    function updateButtonState() {
        const hasApiKey = elements.apiKey.value.trim().length > 0;
        const hasCity = elements.city.value.trim().length > 0;
        const hasCountry = elements.country.value.trim().length > 0;

        elements.getWeather.disabled = !(hasApiKey && hasCity && hasCountry);
    }

    function showError(message) {
        elements.errorText.textContent = message;
        elements.errorSection.hidden = false;
        elements.weatherSection.hidden = true;
        elements.loadingSection.hidden = true;
    }

    function hideError() {
        elements.errorSection.hidden = true;
    }

    function showLoading() {
        hideError();
        elements.weatherSection.hidden = true;
        elements.loadingSection.hidden = false;
        elements.getWeather.disabled = true;
    }

    function hideLoading() {
        elements.loadingSection.hidden = true;
        updateButtonState();
    }

    function showWeather(data) {
        hideError();
        hideLoading();

        elements.locationName.textContent = `${data.name}, ${data.sys.country}`;
        elements.temperatureValue.textContent = Math.round(data.main.temp);
        elements.weatherCondition.textContent = data.weather[0].description;
        elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        elements.humidity.textContent = `${data.main.humidity}%`;
        elements.pressure.textContent = `${data.main.pressure} hPa`;
        elements.windSpeed.textContent = `${data.wind.speed} m/s`;
        elements.sunrise.textContent = formatTime(data.sys.sunrise, data.timezone);
        elements.sunset.textContent = formatTime(data.sys.sunset, data.timezone);

        elements.weatherSection.hidden = false;
    }

    function formatTime(unixTimestamp, timezoneOffset) {
        const date = new Date((unixTimestamp + timezoneOffset) * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' });
    }

    async function handleGetWeather() {
        const apiKey = elements.apiKey.value.trim();
        const city = elements.city.value.trim();
        const country = elements.country.value.trim().toUpperCase();

        if (!apiKey || !city || !country) {
            showError('Please fill in all fields: API Key, City, and Country.');
            return;
        }

        showLoading();

        const query = `${city},${country}`;
        const url = `${API_BASE_URL}?q=${encodeURIComponent(query)}&appid=${encodeURIComponent(apiKey)}&units=metric`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                let errorMessage = 'Failed to fetch weather data.';

                if (response.status === 401) {
                    errorMessage = 'Invalid API key. Please check your OpenWeatherMap API key.';
                } else if (response.status === 404) {
                    errorMessage = `Location "${city}, ${country}" not found. Please check the city and country code.`;
                } else if (response.status === 429) {
                    errorMessage = 'API rate limit exceeded. Please try again later.';
                } else if (response.status >= 500) {
                    errorMessage = 'Weather service is temporarily unavailable. Please try again later.';
                }

                const errorData = await response.json().catch(() => ({}));
                if (errorData.message) {
                    errorMessage = errorData.message;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            showWeather(data);

        } catch (error) {
            hideLoading();
            showError(error.message || 'An unexpected error occurred. Please try again.');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
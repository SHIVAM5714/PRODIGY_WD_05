 let currentUnit = 'metric';
let currentLocation = null;

// Weather icons mapping
const weatherIcons = {
    '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    getCurrentLocation();
    
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
});

function setUnit(unit) {
    currentUnit = unit;
    document.querySelectorAll('.unit-btn').forEach(btn => btn.classList.remove('active'));
    if (unit === 'metric') {
        document.getElementById('celsiusBtn').classList.add('active');
    } else {
        document.getElementById('fahrenheitBtn').classList.add('active');
    }
    
    if (currentLocation) {
        fetchWeatherData(currentLocation.lat, currentLocation.lon);
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                currentLocation = { lat, lon };
                fetchWeatherData(lat, lon);
            },
            error => {
                console.error('Geolocation error:', error);
                // Fallback to a default location (New York)
                currentLocation = { lat: 40.7128, lon: -74.0060 };
                fetchWeatherData(40.7128, -74.0060);
            }
        );
    } else {
        // Fallback to a default location
        currentLocation = { lat: 40.7128, lon: -74.0060 };
        fetchWeatherData(40.7128, -74.0060);
    }
}

function searchWeather() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    document.getElementById('weatherContent').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Searching for weather data...</p>
        </div>
    `;

    // For demo purposes, we'll simulate API calls with mock data
    setTimeout(() => {
        const mockData = generateMockWeatherData(query);
        displayWeatherData(mockData);
    }, 1000);
}

function fetchWeatherData(lat, lon) {
    // Simulate API call with mock data
    setTimeout(() => {
        const mockData = generateMockWeatherData('Current Location', lat, lon);
        displayWeatherData(mockData);
    }, 1500);
}

function generateMockWeatherData(location, lat = 40.7128, lon = -74.0060) {
    const conditions = ['clear', 'cloudy', 'rainy', 'snowy', 'stormy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const baseTemp = currentUnit === 'metric' ? 
        Math.floor(Math.random() * 30) + 5 : 
        Math.floor(Math.random() * 50) + 40;

    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    const speedUnit = currentUnit === 'metric' ? 'km/h' : 'mph';
    const visibilityUnit = currentUnit === 'metric' ? 'km' : 'miles';

    return {
        location: location,
        current: {
            temp: baseTemp,
            condition: condition,
            description: getWeatherDescription(condition),
            icon: getWeatherIcon(condition),
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            pressure: Math.floor(Math.random() * 50) + 1000,
            visibility: Math.floor(Math.random() * 10) + 5,
            uvIndex: Math.floor(Math.random() * 11),
            feelsLike: baseTemp + Math.floor(Math.random() * 6) - 3
        },
        forecast: generateForecast(baseTemp),
        airQuality: {
            aqi: Math.floor(Math.random() * 200) + 50,
            pm25: Math.floor(Math.random() * 50) + 10,
            pm10: Math.floor(Math.random() * 80) + 20,
            o3: Math.floor(Math.random() * 100) + 50,
            no2: Math.floor(Math.random() * 80) + 20
        },
        units: {
            temp: tempUnit,
            speed: speedUnit,
            visibility: visibilityUnit
        }
    };
}

function generateForecast(baseTemp) {
    const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const forecast = [];
    
    for (let i = 0; i < 7; i++) {
        const dayTemp = baseTemp + Math.floor(Math.random() * 10) - 5;
        const condition = ['clear', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)];
        
        forecast.push({
            day: days[i],
            high: dayTemp + Math.floor(Math.random() * 5),
            low: dayTemp - Math.floor(Math.random() * 8),
            condition: condition,
            icon: getWeatherIcon(condition),
            description: getWeatherDescription(condition)
        });
    }
    
    return forecast;
}

function getWeatherIcon(condition) {
    const icons = {
        clear: '☀️',
        cloudy: '☁️',
        rainy: '🌧️',
        snowy: '❄️',
        stormy: '⛈️'
    };
    return icons[condition] || '☀️';
}

function getWeatherDescription(condition) {
    const descriptions = {
        clear: 'Clear sky',
        cloudy: 'Partly cloudy',
        rainy: 'Light rain',
        snowy: 'Snow showers',
        stormy: 'Thunderstorms'
    };
    return descriptions[condition] || 'Pleasant weather';
}

function getAQILevel(aqi) {
    if (aqi <= 50) return { level: 'Good', color: '#00e400' };
    if (aqi <= 100) return { level: 'Moderate', color: '#ffff00' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: '#ff7e00' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#ff0000' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#8f3f97' };
    return { level: 'Hazardous', color: '#7e0023' };
}

function displayWeatherData(data) {
    const aqiInfo = getAQILevel(data.airQuality.aqi);
    
    document.getElementById('weatherContent').innerHTML = `
        <div class="weather-grid">
            <div class="main-weather">
                <div class="weather-icon">${data.current.icon}</div>
                <div class="temperature">${data.current.temp}${data.units.temp}</div>
                <div class="location">${data.location}</div>
                <div class="description">${data.current.description}</div>
                
                <div class="weather-details">
                    <div class="detail-card">
                        <div class="detail-icon">🌡️</div>
                        <div class="detail-value">${data.current.feelsLike}${data.units.temp}</div>
                        <div class="detail-label">Feels Like</div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">💧</div>
                        <div class="detail-value">${data.current.humidity}%</div>
                        <div class="detail-label">Humidity</div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">💨</div>
                        <div class="detail-value">${data.current.windSpeed} ${data.units.speed}</div>
                        <div class="detail-label">Wind Speed</div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">🔽</div>
                        <div class="detail-value">${data.current.pressure} hPa</div>
                        <div class="detail-label">Pressure</div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">👁️</div>
                        <div class="detail-value">${data.current.visibility} ${data.units.visibility}</div>
                        <div class="detail-label">Visibility</div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">☀️</div>
                        <div class="detail-value">${data.current.uvIndex}</div>
                        <div class="detail-label">UV Index</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="air-quality">
            <h3 class="section-title">Air Quality</h3>
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 2rem; font-weight: bold; margin-bottom: 10px;">${data.airQuality.aqi}</div>
                <div style="font-size: 1.2rem; color: ${aqiInfo.color};">${aqiInfo.level}</div>
            </div>
            <div class="aqi-meter">
                <div class="aqi-indicator" style="left: ${(data.airQuality.aqi / 300) * 100}%;"></div>
            </div>
            <div class="weather-details">
                <div class="detail-card">
                    <div class="detail-value">${data.airQuality.pm25}</div>
                    <div class="detail-label">PM2.5</div>
                </div>
                <div class="detail-card">
                    <div class="detail-value">${data.airQuality.pm10}</div>
                    <div class="detail-label">PM10</div>
                </div>
                <div class="detail-card">
                    <div class="detail-value">${data.airQuality.o3}</div>
                    <div class="detail-label">Ozone</div>
                </div>
                <div class="detail-card">
                    <div class="detail-value">${data.airQuality.no2}</div>
                    <div class="detail-label">NO₂</div>
                </div>
            </div>
        </div>

        <div class="forecast-section">
            <h3 class="section-title">7-Day Forecast</h3>
            <div class="forecast-container">
                ${data.forecast.map(day => `
                    <div class="forecast-card">
                        <div class="forecast-day">${day.day}</div>
                        <div class="forecast-icon">${day.icon}</div>
                        <div class="forecast-temps">
                            <div class="forecast-high">${day.high}${data.units.temp}</div>
                            <div class="forecast-low">${day.low}${data.units.temp}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
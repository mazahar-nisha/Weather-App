# Weatherly

A simple, clean, and responsive weather web application built with vanilla HTML, CSS, and JavaScript. Uses the OpenWeatherMap API to fetch live weather data.

## Features

- Search weather by city and country code
- Secure API key input (stored locally in browser)
- Real-time weather data including:
  - Current temperature
  - Weather condition
  - Feels like temperature
  - Humidity
  - Pressure
  - Wind speed
  - Sunrise and sunset times
- Clean, modern, minimalist UI
- Fully responsive design
- Error handling for invalid API keys, unknown locations, and network issues
- Accessible markup with proper ARIA attributes

## Demo

Open `index.html` in a web browser to use the application.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An OpenWeatherMap API key (free)

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser

No build step or server required — it's a static web application.

### Getting an API Key

1. Go to [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "My API Keys" and copy your key
4. Enter the key in the Weatherly application

The API key is stored in your browser's localStorage so you only need to enter it once.

## Project Structure

```
weatherly/
├── index.html      # Main HTML structure
├── styles.css      # Styling (clean, minimalist, responsive)
├── app.js          # Application logic and API integration
└── README.md       # This file
```

## Usage

1. Enter your OpenWeatherMap API key (saved automatically)
2. Enter a city name (e.g., "London")
3. Enter a country code (e.g., "GB" for United Kingdom, "US" for United States)
4. Click "Get Weather" or press Enter

## Error Handling

The application handles common error scenarios:

| Error | Message |
|-------|---------|
| Invalid API Key | "Invalid API key. Please check your OpenWeatherMap API key." |
| Location Not Found | "Location 'City, CC' not found. Please check the city and country code." |
| Rate Limited | "API rate limit exceeded. Please try again later." |
| Server Error | "Weather service is temporarily unavailable. Please try again later." |
| Network Error | "An unexpected error occurred. Please try again." |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## API Reference

Data provided by [OpenWeatherMap](https://openweathermap.org/)

Endpoint used: `https://api.openweathermap.org/data/2.5/weather`

## License

MIT License — feel free to use this project for learning or personal projects.

## Acknowledgments

- Weather data by [OpenWeatherMap](https://openweathermap.org/)
- Icons inspired by [Feather Icons](https://feathericons.com/)
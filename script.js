
const API_KEY = "59264d2126d7f7a57d37a5f62eff28f7";


const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("txtCity");
const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");

async function LoadWeather(cityName = "Hyderabad") {
    if (!API_KEY || API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        showError("Please add your OpenWeatherMap API key in script.js.");
        return;
    }

    errorMessage.hidden = true;
    loadingMessage.hidden = false;

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?q=${encodeURIComponent(cityName)}` +
            `&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load weather information."
            );
        }

        document.getElementById("lblCity").textContent = data.name;

        document.getElementById("lblTemp").textContent =
            `${Math.round(data.main.temp)}°`;

        document.getElementById("lblDescription").textContent =
            data.weather[0].description;

        document.getElementById("feelsLike").textContent =
            `Feels like ${Math.round(data.main.feels_like)}°C`;

        document.getElementById("lblHumidity").textContent =
            `${data.main.humidity}%`;

        // OpenWeatherMap reports wind speed in m/s for metric units.
        const windKmh = data.wind.speed * 3.6;

        document.getElementById("lblSpeed").textContent =
            `${windKmh.toFixed(1)} km/h`;

        document.getElementById("lblPressure").textContent =
            `${data.main.pressure} hPa`;

        document.getElementById("lblVisibility").textContent =
            `${(data.visibility / 1000).toFixed(1)} km`;

        const iconCode = data.weather[0].icon;

        document.getElementById("weatherIcon").src =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        document.getElementById("weatherIcon").alt =
            data.weather[0].description;

        document.getElementById("updatedLabel").textContent =
            `Updated at ${new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
            })}`;

        cityInput.value = data.name;

    } catch (error) {
        showError(
            error.message === "Failed to fetch"
                ? "Network error. Please check your internet connection."
                : error.message
        );
    } finally {
        loadingMessage.hidden = true;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (cityName) {
        LoadWeather(cityName);
    }
});

document.querySelectorAll("[data-city]").forEach(function (button) {
    button.addEventListener("click", function () {
        LoadWeather(button.dataset.city);
    });
});

// Load the default city's weather when the page opens.
LoadWeather("Hyderabad");

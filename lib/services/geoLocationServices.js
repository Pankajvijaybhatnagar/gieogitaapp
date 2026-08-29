

// /lib/services/geoLocationServices.js

async function geoApiRequest(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        // Nominatim requires a valid User-Agent
        "User-Agent": "your-app-name (your@email.com)"
      }
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = [];
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: "Geo request failed",
        data
      };
    }

    return {
      success: true,
      status: response.status,
      data
    };

  } catch (err) {
    return {
      success: false,
      status: 0,
      error: err.message
    };
  }
}

const geoLocationServices = {

  // 🔍 SEARCH LOCATION (like radaur, delhi, etc.)
  searchLocation(query) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`;
    return geoApiRequest(url);
  },

  // 📍 REVERSE GEO (lat, lng → address)
  reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    return geoApiRequest(url);
  }

};

export default geoLocationServices;
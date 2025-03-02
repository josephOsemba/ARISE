import axios from 'axios';

// Axios instance for base configuration
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to scrape a website
export const scrapeWebsite = async (url) => {
  try {
    const response = await instance.post('/scrape', { url });
    return response.data;
  } catch (error) {
    console.error('Scraping Error:', error.response ? error.response.data : error.message);
    return null;
  }
};

export default instance;

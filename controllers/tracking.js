import axios from 'axios';

const trackShipment = async (trackingNumber) => {
  try {
    const response = await axios.get(`https://api.indiapost.gov.in/track/${trackingNumber}`, {
      headers: {
        Authorization: `Bearer YOUR_API_KEY`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

trackShipment('EX123456789IN');

const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');

const getAnalytics = asyncHandler(async (req, res) => {
  const data = {
    totalUsers: 150,
    totalTrips: 320,
    popularCities: ['Paris', 'Tokyo', 'Bali'],
    popularActivities: ['Sightseeing', 'Food Tour']
  };
  sendResponse(res, 200, 'Analytics fetched successfully', data);
});

module.exports = { getAnalytics };

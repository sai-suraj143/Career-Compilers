const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');

const search = asyncHandler(async (req, res) => {
  const query = req.query.q || '';
  const mockCities = [
    { name: 'Paris', country: 'France' },
    { name: 'Tokyo', country: 'Japan' },
    { name: 'New York', country: 'USA' }
  ].filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  sendResponse(res, 200, 'Cities fetched successfully', mockCities);
});

module.exports = { search };

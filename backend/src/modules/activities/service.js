const repo = require('./repository');
const budgetService = require('../budgets/service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => {
  const activity = await repo.create(data);
  if(data.tripId) await budgetService.recalculate(data.tripId);
  return activity;
};

const update = async (id, data) => {
  const activity = await repo.update(id, data);
  if(data.tripId) await budgetService.recalculate(data.tripId);
  return activity;
};

const remove = async (id) => {
  await repo.remove(id);
  return true;
};

const search = async (q, stopId) => {
  let cityName = "your destination";
  if (stopId) {
    const stop = await prisma.stop.findUnique({ where: { id: stopId } });
    if (stop) cityName = stop.cityName;
  }
  
  const query = (q || '').toLowerCase();
  
  const mockActivities = [
    { title: `${cityName} Food Walk`, category: 'Food & Drink', cost: 45, duration: 180, description: `Taste the best local delicacies in ${cityName} with a guided tour.` },
    { title: `Historical Museum of ${cityName}`, category: 'Culture', cost: 15, duration: 120, description: `Explore the rich history and heritage of ${cityName}.` },
    { title: `Sunrise Boat Ride`, category: 'Nature', cost: 25, duration: 90, description: `Experience a breathtaking sunrise view on the water.` },
    { title: `Sunset Cruise`, category: 'Nature', cost: 35, duration: 120, description: `Relax with a beautiful sunset cruise and drinks.` },
    { title: `Guided Temple Visit`, category: 'Culture', cost: 10, duration: 60, description: `Visit the sacred temples and shrines with an expert guide.` },
    { title: `Local Night Market`, category: 'Shopping', cost: 5, duration: 150, description: `Shop for souvenirs and enjoy vibrant street food.` },
    { title: `Mountain Trekking`, category: 'Adventure', cost: 50, duration: 300, description: `A thrilling hike through the scenic trails surrounding ${cityName}.` },
    { title: `Beach Water Sports`, category: 'Adventure', cost: 80, duration: 240, description: `Jet skiing, parasailing, and more by the water.` },
    { title: `Camping under the stars`, category: 'Nature', cost: 60, duration: 720, description: `Overnight camping experience with a bonfire.` },
    { title: `City Sightseeing Bus`, category: 'Tour', cost: 20, duration: 240, description: `Hop-on hop-off bus tour covering major attractions.` },
  ];
  
  let results = mockActivities;
  if (query) {
    results = results.filter(a => 
      a.title.toLowerCase().includes(query) || 
      a.category.toLowerCase().includes(query) || 
      a.description.toLowerCase().includes(query)
    );
  }
  
  return results.map((a, i) => ({
    id: `mock-${i}-${Date.now()}`,
    ...a,
    activityDate: new Date().toISOString()
  }));
};

module.exports = { create, update, remove, search };

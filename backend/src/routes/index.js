const express = require('express');
const authRoutes = require('../modules/auth/routes');
const tripRoutes = require('../modules/trips/routes');
const itineraryRoutes = require('../modules/itinerary/routes');
const activityRoutes = require('../modules/activities/routes');
const budgetRoutes = require('../modules/budgets/routes');
const checklistRoutes = require('../modules/checklist/routes');
const noteRoutes = require('../modules/notes/routes');
const sharingRoutes = require('../modules/sharing/routes');
const cityRoutes = require('../modules/cities/routes');
const userRoutes = require('../modules/users/routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/stops', itineraryRoutes);
router.use('/activities', activityRoutes);
router.use('/budget', budgetRoutes);
router.use('/checklist', checklistRoutes);
router.use('/notes', noteRoutes);
router.use('/share', sharingRoutes);
router.use('/cities', cityRoutes);
router.use('/users', userRoutes);

module.exports = router;

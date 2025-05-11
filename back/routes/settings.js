const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataHelpers');

// Initialize settings data
let {settings, lastId} = readData('settings.json') || { settings: [], lastId: 0 };

function saveSettings() {
  writeData('settings.json', {settings, lastId});
}

// GET settings for a user
router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userSettings = settings.find(s => s.user_id === userId) || {
    user_id: userId,
    currency: 'KZT',
    language: 'en',
    theme: 'light'
  };
  
  res.json(userSettings);
});

// UPDATE user settings
router.put('/update/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  let userSettings = settings.find(s => s.user_id === userId);
  
  if (!userSettings) {
    // Create new settings if they don't exist
    lastId = lastId + 1;
    userSettings = {
      id: lastId,
      user_id: userId,
      ...req.body
    };
    settings.push(userSettings);
  } else {
    // Update existing settings
    const { currency, language, theme, notification_preferences } = req.body;
    userSettings.currency = currency || userSettings.currency;
    userSettings.language = language || userSettings.language;
    userSettings.theme = theme || userSettings.theme;
    userSettings.notification_preferences = notification_preferences || 
      userSettings.notification_preferences;
  }
  
  saveSettings();
  res.json(userSettings);
});

module.exports = router;
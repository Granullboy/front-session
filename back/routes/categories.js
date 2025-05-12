const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataHelpers');

// Initialize categories data
let {categories, lastId} = readData('categories.json') || { categories: [], lastId: 0 };

function saveCategories() {
  writeData('categories.json', {categories, lastId});
}

// GET all categories
router.get('/', (req, res) => {
  res.json(categories);
});

router.get('/account/:accountId', (req, res) => {
  const accountId = parseInt(req.params.accountId);
  const accountCategories = categories.filter(category => 
    category.account_id.includes(accountId)
  );
  
  res.json(accountCategories);
});

router.get('/category/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const accountCategories = categories.filter(category => 
    category.category_id.includes(categoryId)
  );
  
  res.json(accountCategories);
});

router.get('/:id', (req, res) => {
  const category_id = parseInt(req.params.id);
  const category = categories.find(b => b.id === category_id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  res.json(category);
});

// POST new category
router.post('/new-category', (req, res) => {
  const { account_id, name, icon, color, type } = req.body;
  lastId = lastId + 1
  const newCategory = {
    id: lastId,
    account_id: Array.isArray(account_id) ? account_id : [],
    name,
    icon,
    color,
    type,
    createdAt: new Date().toISOString(),
  };
  categories.push(newCategory);
  saveCategories();
  res.status(201).json(newCategory);
});

// UPDATE category
router.put('/update/:id', (req, res) => {
  const category_id = parseInt(req.params.id);
  const category = categories.find(b => b.id === category_id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const { account_id, amount, type } = req.body;
  category.account_id = Array.isArray(account_id) ? account_id : category.account_id;
  category.amount = amount || category.amount;
  category.type = type || category.type;
  category.category_id = Array.isArray(category_id) ? category_id : category.category_id;
  category.comment = comment || category.comment;
  category.date = date || category.date;

  saveCategories();
  res.json(category);
});

// DELETE category
router.delete('/delete/:id', (req, res) => {
  const category_id = parseInt(req.params.id);
  categories = categories.filter(b => b.id !== category_id);
  saveCategories();
  res.status(204).send();
});

module.exports = router;
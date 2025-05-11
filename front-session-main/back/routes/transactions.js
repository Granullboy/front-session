const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataHelpers');

// Initialize transactions data
let {transactions, lastId} = readData('transactions.json') || { transactions: [], lastId: 0 };

function saveTransactions() {
  writeData('transactions.json', {transactions, lastId});
}

// GET all transactions
router.get('/', (req, res) => {
  res.json(transactions);
});

router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userTransactions = transactions.filter(transaction => 
    transaction.user_id.includes(userId)
  );
  
  res.json(userTransactions);
});

router.get('/category/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const userTransactions = transactions.filter(transaction => 
    transaction.category_id.includes(categoryId)
  );
  
  res.json(userTransactions);
});

router.get('/:id', (req, res) => {
  const transaction_id = parseInt(req.params.id);
  const transaction = transactions.find(b => b.id === transaction_id);
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

  res.json(transaction);
});

// POST new transaction
router.post('/new-transaction', (req, res) => {
  const { user_id, amount, type, category_id, comment, date } = req.body;
  lastId = lastId + 1
  const newTransaction = {
    id: lastId,
    user_id: Array.isArray(user_id) ? user_id : [],
    amount,
    type,
    category_id: Array.isArray(category_id) ? category_id : [],
    comment,
    date,
    createdAt: new Date().toISOString(),
  };
  transactions.push(newTransaction);
  saveTransactions();
  res.status(201).json(newTransaction);
});

// UPDATE transaction
router.put('/update/:id', (req, res) => {
  const transaction_id = parseInt(req.params.id);
  const transaction = transactions.find(b => b.id === transaction_id);
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

  const { user_id, amount, type, category_id, comment, date } = req.body;
  transaction.user_id = Array.isArray(user_id) ? user_id : transaction.user_id;
  transaction.amount = amount || transaction.amount;
  transaction.type = type || transaction.type;
  transaction.category_id = Array.isArray(category_id) ? category_id : transaction.category_id;
  transaction.comment = comment || transaction.comment;
  transaction.date = date || transaction.date;

  saveTransactions();
  res.json(transaction);
});

// DELETE transaction
router.delete('/delete/:id', (req, res) => {
  const transaction_id = parseInt(req.params.id);
  transactions = transactions.filter(b => b.id !== transaction_id);
  saveTransactions();
  res.status(204).send();
});

module.exports = router;
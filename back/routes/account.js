const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataHelpers');

let { accounts, lastId } = readData('accounts.json') || { accounts: [], lastId: 0 };

function saveAccounts() {
  writeData('accounts.json', { accounts, lastId });
}

// GET all accounts
router.get('/', (req, res) => {
  res.json(accounts);
});

// GET accounts for specific user
router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userAccounts = accounts.filter(acc => acc.user_id === userId);
  res.json(userAccounts);
});

// GET single account by ID
router.get('/:id', (req, res) => {
  const accountId = parseInt(req.params.id);
  const account = accounts.find(acc => acc.id === accountId);
  if (!account) return res.status(404).json({ message: 'Account not found' });
  res.json(account);
});

// POST new account
router.post('/new-account', (req, res) => {
  const { user_id, name, balance = 0, currency = 'KZT' } = req.body;
  
  lastId++;
  const newAccount = {
    id: lastId,
    user_id,
    name,
    balance,
    currency,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  saveAccounts();

  res.status(201).json(newAccount);
});

// UPDATE account
router.put('/update/:id', (req, res) => {
  const accountId = parseInt(req.params.id);
  const account = accounts.find(acc => acc.id === accountId);
  if (!account) return res.status(404).json({ message: 'Account not found' });

  const { name, balance, currency } = req.body;

  if (name !== undefined) account.name = name;
  if (balance !== undefined) account.balance = balance;
  if (currency !== undefined) account.currency = currency;

  saveAccounts();
  res.json(account);
});

// DELETE account
router.delete('/delete/:id', (req, res) => {
  const accountId = parseInt(req.params.id);
  accounts = accounts.filter(acc => acc.id !== accountId);
  saveAccounts();
  res.status(204).send();
});

module.exports = router;

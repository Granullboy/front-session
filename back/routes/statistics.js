const express = require('express');
const router = express.Router();
const { readData } = require('../utils/dataHelpers');

function getFreshData() {
  return {
    transactions: readData('transactions.json')?.transactions || [],
    categories: readData('categories.json')?.categories || []
  };
}

// GET статистика для пользователя
router.get('/user/:userId', (req, res) => {
  const { transactions, categories } = getFreshData();
  const userId = parseInt(req.params.userId);
  
  const userTransactions = transactions.filter(t => t.user_id.includes(userId));
  const userCategories = categories.filter(c => c.user_id.includes(userId));
  
  // Рассчитать общие доходы и расходы
  const income = userTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = userTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Рассчитать баланс
  const balance = income - expenses;
  
  // Группировать по категориям
  const categoryStats = userCategories.map(category => {
    const catTransactions = userTransactions.filter(t => 
      t.category_id.includes(category.id)
    );
    
    const catTotal = catTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      category_id: category.id,
      category_name: category.name,
      total: catTotal,
      type: category.type,
      color: category.color,
      icon: category.icon,
      transaction_count: catTransactions.length
    };
  });
  
  res.json({
    user_id: userId,
    balance,
    total_income: income,
    total_expenses: expenses,
    transaction_count: userTransactions.length,
    category_stats: categoryStats,
    recent_transactions: userTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  });
});

// GET статистика по определенной категории
router.get('/category/:categoryIds', (req, res) => {
  const { transactions, categories } = getFreshData();
  
  // Разделить идентификаторы категорий, разделенные запятыми, и преобразовать в числа
  const categoryIds = req.params.categoryIds.split(',').map(id => parseInt(id.trim()));
  
  // Проверить наличие всех идентификаторов категорий
  const invalidCategories = categoryIds.filter(id => 
    !categories.some(c => c.id === id)
  );
  
  if (invalidCategories.length > 0) {
    return res.status(404).json({ 
      message: 'Some categories not found',
      invalidCategories 
    });
  }
  
  // Получить данные по всем запрошенным категориям
  const categoryStats = categoryIds.map(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    const catTransactions = transactions.filter(t => 
      t.category_id.includes(categoryId)
    );
    
    const catTotal = catTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      category_id: categoryId,
      category_name: category.name,
      type: category.type,
      total_amount: catTotal,
      transaction_count: catTransactions.length,
      average_amount: catTotal / (catTransactions.length || 1),
      transactions: catTransactions
    };
  });
  
  // Рассчитать общие итоги
  const combinedStats = {
    total_amount: categoryStats.reduce((sum, cat) => sum + cat.total_amount, 0),
    transaction_count: categoryStats.reduce((sum, cat) => sum + cat.transaction_count, 0),
    categories: categoryStats
  };
  
  res.json(combinedStats);
});

module.exports = router;
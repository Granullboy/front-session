import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchTransactions } from '../redux/slices/transactionSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { createTransaction } from '../api/transactions';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { items: transactions } = useAppSelector((state) => state.transactions);
  const { items: categoriesList } = useAppSelector((state) => state.categories);
  const token = useAppSelector((state) => state.auth.token);

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<number[]>([]);
  const [comment, setComment] = useState('');

  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchTransactions());
      dispatch(fetchCategories());
    }
  }, [dispatch, userId]);

  const balance = useMemo(() => {
    return transactions.reduce(
      (acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount),
      0
    );
  }, [transactions]);

  const handleAddTransaction = async () => {
    if (!amount || !category || !userId) return;

    const newTransaction = {
      user_id: [userId],
      amount: parseFloat(amount),
      type,
      category_id: category,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      await createTransaction(newTransaction);
      dispatch(fetchTransactions());
    } catch (err) {
      console.error('Create error:', err);
    }

    setAmount('');
    setCategory([]);
    setComment('');
    setType('income');
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-white dark:bg-slate-900 min-h-screen transition-colors text-black dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Dashboard</h2>

      <div className="bg-white dark:bg-gray-800 shadow rounded-md p-4 mb-6 transition-colors">
        <p className="text-lg font-medium">Current Balance:</p>
        <p
          className={`text-2xl font-bold ${
            balance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {balance} ₸
        </p>
      </div>

      <TransactionList transactions={transactions} categories={categoriesList} />

      <div className="text-center mt-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            + Add Transaction
          </button>
        ) : (
          <TransactionForm
            type={type}
            setType={setType}
            amount={amount}
            setAmount={setAmount}
            category={category}
            setCategory={setCategory}
            comment={comment}
            setComment={setComment}
            categoriesList={categoriesList}
            onCancel={() => setShowForm(false)}
            onSave={handleAddTransaction}
          />
        )}
      </div>
    </div>
  );
};

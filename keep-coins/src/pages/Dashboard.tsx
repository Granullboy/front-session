import { useEffect, useMemo, useState } from 'react';
import { getTransactionsByUser, createTransaction } from '../api/transactions';
import { getCategoriesByUser } from '../api/categories';
import type { Transaction } from '../api/transactions';
import type { Category } from '../api/categories';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';

export const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');

  const token = useSelector((state: RootState) => state.auth.token);
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const tx = await getTransactionsByUser(userId);
      const cats = await getCategoriesByUser(userId);
      setTransactions(tx);
      setCategoriesList(cats);
    };

    fetchData();
  }, [userId]);

  const balance = useMemo(() => {
    return transactions.reduce((acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount), 0);
  }, [transactions]);

  const handleAddTransaction = async () => {
    if (!amount || !category || !userId) return;

    const newTransaction = {
      user_id: [userId],
      amount: parseFloat(amount),
      type,
      category_id: [parseInt(category)],
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const created = await createTransaction(newTransaction);
      setTransactions([created, ...transactions]);
    } catch (err) {
      console.error('Create error:', err);
    }

    setAmount('');
    setCategory('');
    setComment('');
    setType('income');
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6">Dashboard</h2>

      <div className="bg-white shadow rounded-md p-4 mb-6">
        <p className="text-lg font-medium">Current Balance:</p>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {balance} ₸
        </p>
      </div>

      <TransactionList transactions={transactions} categories={categoriesList} />

      <div className="text-center mt-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

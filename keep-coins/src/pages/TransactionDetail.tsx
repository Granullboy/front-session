import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Transaction, Category } from '../types/types';
import { getTransactionById } from '../api/transactions';
import { getCategoriesByUser } from '../api/categories';
import { useAppSelector } from '../hooks/reduxHooks';

export const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const token = useAppSelector((state) => state.auth.token);
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    if (!id || !userId) return;

    const fetchData = async () => {
      const tx = await getTransactionById(Number(id));
      setTransaction(tx);

      const userCategories = await getCategoriesByUser(userId);
      const matchedCategory = userCategories.find(
        (cat) => cat.id === tx.category_id[0]
      );
      setCategory(matchedCategory || null);
    };

    fetchData();
  }, [id, userId]);

  if (!transaction) {
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
        Loading transaction...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-[#081F5C] dark:text-white">
          Transaction Details
        </h2>

        <div className="text-gray-800 dark:text-gray-200 space-y-3 mt-6">
          <p>
            <span className="font-semibold">Category:</span>{' '}
            {category?.name || 'Unknown'}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {transaction.type}
          </p>
          <p>
            <span className="font-semibold">Amount:</span>{' '}
            <span
              className={
                transaction.type === 'income'
                  ? 'text-green-600'
                  : 'text-red-500'
              }
            >
              {transaction.amount.toLocaleString()} ₸
            </span>
          </p>
          <p>
            <span className="font-semibold">Comment:</span>{' '}
            {transaction.comment || '—'}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{' '}
            {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  ); 
};

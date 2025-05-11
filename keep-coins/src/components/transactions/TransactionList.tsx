import type { Transaction, Category } from '../../types/types';

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

export const TransactionList = ({ transactions, categories }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white shadow rounded-md p-4 mb-6 transition-colors">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((t) => {
          const categoryName =
            categories.find((c) => c.id === t.category_id?.[0])?.name || `Category #${t.category_id?.[0]}`;

          return (
            <li key={t.id} className="py-2 flex justify-between">
              <span>
                <span className="font-medium">{categoryName}</span>{' '}
                <span className="text-sm text-gray-500 dark:text-gray-400">({t.date})</span>
              </span>
              <span className={t.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                {t.type === 'income' ? '+' : '-'}
                {t.amount} ₸
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

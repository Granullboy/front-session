import type { Category } from '../../types/types';

interface Props {
  type: 'income' | 'expense';
  setType: (type: 'income' | 'expense') => void;
  amount: string;
  setAmount: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  comment: string;
  setComment: (val: string) => void;
  categoriesList: Category[];
  onCancel: () => void;
  onSave: () => void;
}

export const TransactionForm = ({
  type,
  setType,
  amount,
  setAmount,
  category,
  setCategory,
  comment,
  setComment,
  categoriesList,
  onCancel,
  onSave,
}: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white shadow rounded-md p-4 space-y-4 transition-colors">
      <div className="flex space-x-4">
        <button
          className={`flex-1 py-2 rounded transition-colors ${
            type === 'income'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
          }`}
          onClick={() => setType('income')}
        >
          Income
        </button>
        <button
          className={`flex-1 py-2 rounded transition-colors ${
            type === 'expense'
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
          }`}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600 transition-colors"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600 transition-colors"
      >
        <option value="">Select category</option>
        {categoriesList
          .filter((cat) => cat.type === type)
          .map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
        ))}
      </select>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comment (optional)"
        className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600 transition-colors"
      />
      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:underline">
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchCategories } from '../redux/slices/categorySlice';
import { createCategory, deleteCategory } from '../api/categories';

export const CategoryPage = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const userId = useAppSelector((state) => state.auth.user?.id);

  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !name) return;

    await createCategory({
      user_id:[Number(userId)],
      name,
      color,
      type,
    });
    dispatch(fetchCategories());
    setName('');
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    dispatch(fetchCategories());
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-2 rounded text-black"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          className="p-2 rounded text-black"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10" />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-700">
            <span className="flex gap-2 items-center">
              <span style={{ backgroundColor: cat.color }} className="w-4 h-4 rounded-full inline-block" />
              {cat.name} ({cat.type})
            </span>
            <button onClick={() => handleDelete(cat.id!)} className="text-red-600 hover:underline">🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

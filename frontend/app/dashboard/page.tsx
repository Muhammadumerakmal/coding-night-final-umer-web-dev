'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Item {
  _id: string;
  title: string;
  description: string;
}

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchItems = useCallback(async () => {
    try {
      const { data } = await api.get('items');
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, [router, fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`items/${editingId}`, { title, description });
      } else {
        await api.post('items', { title, description });
      }
      setTitle('');
      setDescription('');
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error('Failed to save item', err);
    }
  };

  const handleEdit = (item: Item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditingId(item._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`items/${id}`);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Items</h1>
          <button onClick={handleLogout} className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600">
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full rounded-md border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full rounded-md border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700">
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setTitle(''); setDescription(''); }}
                className="rounded-md bg-gray-400 px-6 py-2 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item._id} className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-md border border-blue-600 px-3 py-1 text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="rounded-md border border-red-600 px-3 py-1 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="col-span-2 text-center text-gray-500">No items found. Add some!</p>}
        </div>
      </div>
    </div>
  );
}

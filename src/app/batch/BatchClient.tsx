'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const departmentOptions = [
  { code: 'ce', name: 'Civil Engineering' },
  { code: 'eee', name: 'Electrical & Electronic Engineering' },
  { code: 'me', name: 'Mechanical Engineering' },
  { code: 'cse', name: 'Computer Science & Engineering' },
  { code: 'urp', name: 'Urban & Regional Planning' },
  { code: 'arch', name: 'Architecture' },
  { code: 'pme', name: 'Petroleum & Mining Engineering' },
  { code: 'ete', name: 'Electronics & Telecommunication Engineering' },
  { code: 'bme', name: 'Biomedical Engineering' },
  { code: 'mie', name: 'Mechatronics & Industrial Engineering' },
  { code: 'wrp', name: 'Water Resources Engineering' },
  { code: 'mse', name: 'Materials Science & Engineering' },
  { code: 'mme', name: 'Materials and Metallurgical Engineering' },
];

interface BatchClientProps {
  initialDepartment: string;
  initialBatch: string;
}

export default function BatchClient({ initialDepartment, initialBatch }: BatchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDepartment, setSelectedDepartment] = useState(initialDepartment);
  const [selectedBatch, setSelectedBatch] = useState(initialBatch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDepartment || !selectedBatch) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('department', selectedDepartment);
    params.set('batch', selectedBatch);
    router.push(`/batch?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
            Department
          </label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-800"
          >
            <option value="">Select Department</option>
            {departmentOptions.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="batch" className="block text-sm font-medium text-slate-700 mb-2">
            Batch
          </label>
          <select
            id="batch"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-800"
          >
            <option value="">Select Batch</option>
            {Array.from({ length: 13 }, (_, i) => 24 - i).map((batch) => (
              <option key={batch} value={batch.toString().padStart(2, '0')}>
                {batch.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={!selectedDepartment || !selectedBatch}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Students
          </button>
        </div>
      </form>
    </div>
  );
}

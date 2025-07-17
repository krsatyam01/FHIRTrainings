import React, { useState } from 'react';
import { FHIR_BASE_URL } from '../App';

function ViewPatients({ showModal, onViewPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${FHIR_BASE_URL}/Patient?_count=100`, { headers: { 'Accept': 'application/fhir+json' } });
      const bundle = await res.json();
      setPatients(bundle.entry ? bundle.entry.map(e => e.resource) : []);
    } catch (err) {
      showModal('Error', 'Failed to fetch patients.', err.message);
      setPatients([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Patient with ID: ${id}?`)) return;
    try {
      const res = await fetch(`${FHIR_BASE_URL}/Patient/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showModal('Success', `Patient deleted: ${id}`);
        fetchPatients();
      } else {
        showModal('Error', `Delete failed: ${res.statusText}`, data);
      }
    } catch (err) {
      showModal('Error', 'Network error.', err.message);
    }
  };

  React.useEffect(() => { fetchPatients(); }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-700 mb-4">View All Patients</h2>
      <p className="text-slate-600 mb-6">This section fetches and displays a list of all Patient resources currently stored on the FHIR server.</p>
      <button onClick={fetchPatients} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 mb-4">
        Refresh Patients
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-slate-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-slate-600">ID</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-slate-600">Name</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-slate-600">Gender</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-slate-600">Birth Date</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4 text-slate-500">Loading patients...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4 text-slate-500">No patients found.</td></tr>
            ) : patients.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
                <td className="py-2 px-4 text-sm text-slate-800">{p.id}</td>
                <td className="py-2 px-4 text-sm text-slate-800">{p.name?.[0]?.given?.join(' ') + ' ' + p.name?.[0]?.family}</td>
                <td className="py-2 px-4 text-sm text-slate-800">{p.gender || 'N/A'}</td>
                <td className="py-2 px-4 text-sm text-slate-800">{p.birthDate || 'N/A'}</td>
                <td className="py-2 px-4 text-sm text-slate-800">
                  <button
                    className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-600 mr-1"
                    onClick={() => onViewPatient(p.id)}
                  >View Details</button>
                  <button
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(p.id)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ViewPatients;

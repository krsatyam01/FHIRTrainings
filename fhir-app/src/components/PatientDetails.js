import React, { useState } from 'react';
import { FHIR_BASE_URL } from '../App';

function PatientDetails({ showModal, patientId, setPatientId }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPatient = async id => {
    setLoading(true);
    try {
      const res = await fetch(`${FHIR_BASE_URL}/Patient/${id}`, { headers: { 'Accept': 'application/fhir+json' } });
      const data = await res.json();
      if (res.ok) setPatient(data);
      else showModal('Error', `Load failed: ${res.statusText}`, data);
    } catch (err) {
      showModal('Error', 'Network error.', err.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (patientId) fetchPatient(patientId);
  }, [patientId]);

  const handleUpdate = async e => {
    e.preventDefault();
    if (!patientId) {
      showModal('Error', 'No patient ID found for update.');
      return;
    }
    const form = e.target;
    const updatedPatient = {
      resourceType: "Patient",
      id: patientId,
      name: [{
        given: [form.firstName.value],
        family: form.lastName.value
      }],
      gender: form.gender.value,
      birthDate: form.birthDate.value,
      address: [{
        line: [form.addressLine.value],
        city: form.city.value,
        state: form.state.value,
        postalCode: form.postalCode.value
      }]
    };
    try {
      const res = await fetch(`${FHIR_BASE_URL}/Patient/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/fhir+json' },
        body: JSON.stringify(updatedPatient)
      });
      const data = await res.json();
      if (res.ok) {
        showModal('Success', `Patient updated: ${data.id || 'N/A'}`);
        fetchPatient(patientId);
      } else {
        showModal('Error', `Update failed: ${res.statusText}`, data);
      }
    } catch (err) {
      showModal('Error', 'Network error.', err.message);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-700 mb-4">Patient Details & Update</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700">Enter Patient ID</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            placeholder="e.g., patient-123"
            className="flex-grow border border-slate-300 rounded-md shadow-sm p-2"
          />
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
            onClick={() => fetchPatient(patientId)}
          >Load Patient</button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {patient && (
        <>
          <div className="bg-slate-50 p-4 rounded-lg shadow-inner mb-6">
            <h3 className="text-xl font-semibold text-teal-600 mb-2">Loaded Patient: <span>{patient.id}</span></h3>
            <pre className="bg-slate-100 p-3 rounded-md text-sm overflow-x-auto">{JSON.stringify(patient, null, 2)}</pre>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-4">Update Patient Information</h3>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
              <label className="block text-sm font-medium text-slate-700">First Name</label>
              <input name="firstName" defaultValue={patient.name?.[0]?.given?.join(' ')} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Last Name</label>
              <input name="lastName" defaultValue={patient.name?.[0]?.family} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Gender</label>
              <select name="gender" defaultValue={patient.gender} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Birth Date</label>
              <input type="date" name="birthDate" defaultValue={patient.birthDate} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Address Line 1</label>
              <input name="addressLine" defaultValue={patient.address?.[0]?.line?.join(' ')} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">City</label>
              <input name="city" defaultValue={patient.address?.[0]?.city} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">State</label>
              <input name="state" defaultValue={patient.address?.[0]?.state} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Postal Code</label>
              <input name="postalCode" defaultValue={patient.address?.[0]?.postalCode} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
            </div>
            <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700">Update Patient</button>
          </form>
        </>
      )}
    </section>
  );
}

export default PatientDetails;

import React from 'react';
import { FHIR_BASE_URL } from '../App';

function RegisterPatient({ showModal }) {
  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const patient = {
      resourceType: "Patient",
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
      const response = await fetch(`${FHIR_BASE_URL}/Patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/fhir+json' },
        body: JSON.stringify(patient)
      });
      const data = await response.json();
      if (response.ok) {
        showModal('Success', `Patient registered! Resource ID: ${data.id || 'N/A'}`);
        form.reset();
      } else {
        showModal('Error', `Registration failed: ${response.statusText}`, data);
      }
    } catch (err) {
      showModal('Error', 'Network error. Try again later.', err.message);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-700 mb-4">Register New Patient</h2>
      <p className="text-slate-600 mb-6">Use this form to create a new Patient resource on the FHIR server. Provide basic demographic information.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700">First Name</label>
          <input name="firstName" required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Last Name</label>
          <input name="lastName" required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Gender</label>
          <select name="gender" required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Birth Date</label>
          <input type="date" name="birthDate" required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Address Line 1</label>
          <input name="addressLine" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">City</label>
          <input name="city" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">State</label>
          <input name="state" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Postal Code</label>
          <input name="postalCode" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 hover:bg-teal-700">Register Patient</button>
      </form>
    </section>
  );
}

export default RegisterPatient;

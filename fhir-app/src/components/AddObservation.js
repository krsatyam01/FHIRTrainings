import React from 'react';
import { FHIR_BASE_URL } from '../App';

function AddObservation({ showModal }) {
  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const patientId = form.patientId.value;
    const systolic = form.systolic.value;
    const diastolic = form.diastolic.value;

    if (!patientId || !systolic || !diastolic) {
      showModal('Warning', 'Please fill in all fields for the observation.');
      return;
    }

    const observation = {
      resourceType: "Observation",
      status: "final",
      code: {
        coding: [{
          system: "http://loinc.org",
          code: "85354-9",
          display: "Blood pressure panel with all children optional"
        }]
      },
      subject: { reference: `Patient/${patientId}` },
      effectiveDateTime: new Date().toISOString(),
      component: [
        {
          code: {
            coding: [{
              system: "http://loinc.org",
              code: "8480-6",
              display: "Systolic blood pressure"
            }]
          },
          valueQuantity: {
            value: parseInt(systolic),
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mmHg"
          }
        },
        {
          code: {
            coding: [{
              system: "http://loinc.org",
              code: "8462-4",
              display: "Diastolic blood pressure"
            }]
          },
          valueQuantity: {
            value: parseInt(diastolic),
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mmHg"
          }
        }
      ]
    };

    try {
      const res = await fetch(`${FHIR_BASE_URL}/Observation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/fhir+json' },
        body: JSON.stringify(observation)
      });
      const data = await res.json();
      if (res.ok) {
        showModal('Success', `Observation created! Resource ID: ${data.id || 'N/A'}`);
        form.reset();
      } else {
        showModal('Error', `Creation failed: ${res.statusText}`, data);
      }
    } catch (err) {
      showModal('Error', 'Network error.', err.message);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-700 mb-4">Add New Observation (Blood Pressure)</h2>
      <p className="text-slate-600 mb-6">Create a new Blood Pressure Observation resource linked to an existing Patient. Ensure the Patient ID is correct.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700">Patient ID</label>
          <input name="patientId" required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Systolic Blood Pressure (mmHg)</label>
          <input type="number" name="systolic" required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Diastolic Blood Pressure (mmHg)</label>
          <input type="number" name="diastolic" required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
        </div>
        <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700">Add Observation</button>
      </form>
    </section>
  );
}

export default AddObservation;

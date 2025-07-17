import React, { useState } from 'react';
import Tabs from './components/Tabs';
import RegisterPatient from './components/RegisterPatient';
import ViewPatients from './components/ViewPatients';
import PatientDetails from './components/PatientDetails';
import AddObservation from './components/AddObservation';
import Modal from './components/Modal';

const tabs = [
  { id: 'registerPatient', label: 'Register Patient' },
  { id: 'viewPatients', label: 'View Patients' },
  { id: 'patientDetails', label: 'Patient Details' },
  { id: 'addObservation', label: 'Add Observation' },
];

export const FHIR_BASE_URL = 'https://hapi.fhir.org/baseR4';

function App() {
  const [activeTab, setActiveTab] = useState('registerPatient');
  const [modal, setModal] = useState({ open: false, title: '', message: '', details: null });
  const showModal = (title, message, details = null) =>
    setModal({ open: true, title, message, details });
  const closeModal = () => setModal({ ...modal, open: false });

  const [selectedPatientId, setSelectedPatientId] = useState('');

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-700">Beginner FHIR App</h1>
        <p className="mt-2 text-slate-600">A basic patient registry application demonstrating fundamental FHIR operations.</p>
        <p className="mt-1 text-sm text-slate-500">
          Using Public HAPI FHIR Server: <a href={FHIR_BASE_URL} target="_blank" rel="noopener" className="text-teal-600 hover:underline">{FHIR_BASE_URL}</a>
        </p>
      </header>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {activeTab === 'registerPatient' && <RegisterPatient showModal={showModal} />}
        {activeTab === 'viewPatients' && (
          <ViewPatients
            showModal={showModal}
            onViewPatient={id => {
              setSelectedPatientId(id);
              setActiveTab('patientDetails');
            }}
          />
        )}
        {activeTab === 'patientDetails' && (
          <PatientDetails
            showModal={showModal}
            patientId={selectedPatientId}
            setPatientId={setSelectedPatientId}
          />
        )}
        {activeTab === 'addObservation' && <AddObservation showModal={showModal} />}
      </main>
      <Modal {...modal} onClose={closeModal} />
    </div>
  );
}

export default App;

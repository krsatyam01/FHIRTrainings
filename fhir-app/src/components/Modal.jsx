import React from 'react';

function Modal({ open, title, message, details, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm modal-content">
        <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
        <p className="text-slate-700 mb-6">{message}</p>
        {details && <pre className="bg-slate-100 p-3 rounded-md text-sm overflow-x-auto mb-6">{typeof details === 'string' ? details : JSON.stringify(details, null, 2)}</pre>}
        <button onClick={onClose} className="w-full bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">Close</button>
      </div>
    </div>
  );
}

export default Modal;

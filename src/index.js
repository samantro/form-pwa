import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/service-worker.js')
//         .then(registration => {
//             console.log('Registered: Service worker with scope',registration);
//         })
//         .catch(error => {
//             console.log('Service worker registration failed:', error);
//         });
    
//         navigator.serviceWorker.getRegistrations().then(function(registrations) {
//         for (let registration of registrations) {
//             registration.update();
//         }
//         });
// }
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
//   <React.StrictMode>
    <App />
//   </React.StrictMode>
);

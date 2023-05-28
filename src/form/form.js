import "./form.css"

import React, { useState } from 'react';

const Form = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        photoId: ''
    });

    const [emailError, setEmailError] = useState('');
    const [contactError, setContactError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform any additional form data validation here

        // Send POST request

        //     const response = await fetch('http://localhost:3001/user/', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(formData)
        //     });

        //     if (response.ok) {
        //         // Handle successful response
        //         console.log('Data added to the database successfully!');
        //         // Reset the form data
        //         setFormData({
        //             name: '',
        //             email: '',
        //             contact: '',
        //             photoId: ''
        //         });
        //     } else {
        //         // Handle error response
        //         console.log('Failed to add data to the database.');
        //     }
        // } catch (error) {
        //     // Handle fetch error
        //     console.log('An error occurred while adding data to the database.', error);
        // }
        if (navigator.onLine) {
            try {
                const response = await fetch('http://localhost:3001/user/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Handle the server response
                // ...
                if (response.ok) {
                    // Handle successful response
                    console.log('Data added to the database successfully!');
                    // Reset the form data
                    setFormData({
                        name: '',
                        email: '',
                        contact: '',
                        photoId: ''
                    });
                } else {
                    // Handle error response
                    console.log('Failed to add data to the database.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // If the browser is offline, store the form data in the cache
            try {
                const cache = await caches.open('my-cache');
                const offlineRequest = new Request('offline-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                await cache.put(offlineRequest, new Response('offline-data'));
                console.log('Form data cached');
            } catch (error) {
                console.error('Error caching form data:', error);
            }
        }
    };


    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateContact = (contact) => {
        const regex = /^\d{10}$/;
        return regex.test(contact);
    };

    const handleEmailChange = (e) => {
        const { value } = e.target;
        if (validateEmail(value)) {
            setEmailError('');
        } else {
            setEmailError('Please enter a valid email address.');
        }
        handleChange(e);
    };

    const handleContactChange = (e) => {
        const { value } = e.target;
        if (validateContact(value)) {
            setContactError('');
        } else {
            setContactError('Please enter a valid 10-digit contact number.');
        }
        handleChange(e);
    };

    const handlePhotoIdChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, photoId: file });
    };

    return (
        <>
            <h1>Add User</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleEmailChange}
                        required
                    />
                    {emailError && <p className="error">{emailError}</p>}
                </div>
                <div>
                    <label htmlFor="contact">Contact Number:</label>
                    <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleContactChange}
                        required
                    />
                    {contactError && <p className="error">{contactError}</p>}
                </div>
                <div>
                    <label htmlFor="photoId">Photo ID:</label>
                    <input type="file" id="photoId" name="photoId" accept=".pdf, .jpg, .jpeg, .png" onChange={handlePhotoIdChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
        </>

    );
};

export default Form;

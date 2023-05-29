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

    const handleSubmit = event => {
        event.preventDefault();

        // Check if the browser is online
        if (navigator.onLine) {
            // Perform online actions like posting data to the server
            // Example code to post the form data to the server using fetch:
            fetch('http://localhost:3001/user/', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    // Handle the response from the server
                    console.log('Form data submitted successfully!: ', response);
                    setFormData({
                        name: '',
                        email: '',
                        contact: '',
                        photoId: ''
                    });
                })
                .catch(error => {
                    // Handle the error
                    console.error('Error submitting form data:', error);
                });
        } else {
            // Store the form data in the cache
            // Store the form data in the cache
            if ('caches' in window) {
                caches.open('my-cache').then(cache => {
                    cache
                        .match('offline-submissions')
                        .then(response => {
                            if (response) {
                                // If there are already cached submissions, add the new form data to it
                                return response.json();
                            } else {
                                // If there are no cached submissions, create a new array with the form data
                                return [];
                            }
                        })
                        .then(cachedSubmissions => {
                            // Add the new form data to the cached submissions
                            cachedSubmissions.push(formData);

                            // Store the updated submissions in the cache
                            cache.put('offline-submissions', new Response(JSON.stringify(cachedSubmissions)));
                            setFormData({
                                name: '',
                                email: '',
                                contact: '',
                                photoId: ''
                            });
                        })
                        .catch(error => {
                            console.error('Error caching form data:', error);
                        });
                });
            }
            console.log('Form data cached successfully!');
        }
    };

    // Periodically check for internet connection and sync cached data
    setInterval(async () => {
        if (navigator.onLine) {
            // Attempt to sync the cached data with the server
            const cache = await caches.open('my-cache');
            const cachedSubmissions = await cache.match('offline-submissions');

            if (cachedSubmissions) {
                const submissions = await cachedSubmissions.json();

                for (const submission of submissions) {
                    try {
                        const response = await fetch('http://localhost:3001/user/', {
                            method: 'POST',
                            body: JSON.stringify(submission),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            // Remove the synced submission from the cache
                            const updatedSubmissions = submissions.filter(
                                cachedSubmission => cachedSubmission !== submission
                            );

                            await cache.put(
                                'offline-submissions',
                                new Response(JSON.stringify(updatedSubmissions))
                            );
                        }
                    } catch (error) {
                        console.error('Error syncing form data:', error);
                    }
                }
            }
        }
    }, 1000); // Sync every minute (adjust the interval as needed)


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

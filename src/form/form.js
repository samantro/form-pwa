import "./form.css"
import React, { useEffect, useState } from 'react';
// const URL = window.location.origin;


const Form = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        photoId: {}
    });
    const [online, setOnline] = useState(navigator.onLine);
    const [emailError, setEmailError] = useState('');
    const [contactError, setContactError] = useState('');
    
    setInterval(() => setOnline(navigator.onLine), 10*1000);

    useEffect(() => {
        console.log('Called use effect');
        if(navigator.onLine)
            updateCacheWhenOnline();
    }, [online])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async event => {
        event.preventDefault();

        // Check if the browser is online
        if (navigator.onLine) {
            // Posting data to the server
            // fetch(`${URL}/api/user/post`, {
            fetch(`/api/user/post`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log('Form data submitted successfully!: ', response);
                setFormData({ name: '', email: '', contact: '', photoId: {} });
                window.location.reload();
            })
            .catch(error => {
                window.alert(error);
                console.error('Error submitting form data:', error);
            });
        } else {
            // Store the form data in the cache
            if ('caches' in window) {
                var cache = await caches.open('my-cache');
                var response = await cache.match('offline-submissions')
                var cachedSubmissions = (response) ? response.json() : [];
                
                // Add the new form data to the cached submissions
                cachedSubmissions.push(formData);
        
                // Store the updated submissions in the cache
                await cache.put('offline-submissions', new Response(JSON.stringify(cachedSubmissions)));
                setFormData({ name: '', email: '', contact: '', photoId: {} });
                console.log('Cache added in offline-submissions.');
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

    async function updateCacheWhenOnline() {
        // Attempt to sync the cached data with the server
        console.log('Checking data in offline-submission cache.');
        const cache = await caches.open('my-cache');
        const cachedSubmissions = await cache.match('offline-submissions');
    
        if (cachedSubmissions) {
            const submissionsArray = await cachedSubmissions.json();
            if(submissionsArray.length) {
                console.log('offline-submission has cache data.')
                for (let submission of submissionsArray) {
                    try {
                        // const response = await fetch(`${URL}/api/user/post`, {
                        const response = await fetch(`/api/user/post`, {
                            method: 'POST',
                            body: JSON.stringify(submission),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        if (response.ok) { // Remove the synced submission from the cache
                            const updatedCache = await submissionsArray.filter( c => c !== submission);
                            await cache.put( 'offline-submissions', new Response(JSON.stringify(updatedCache)));
                        }
                    } catch (error) {
                        console.error('Error syncing form data:', error);
                    }
                }
                let isDeleted = await cache.delete('offline-submissions')
                console.log(`offline-submission cache cleared: ${isDeleted}`)
                window.location.reload();
            }
        }
    }

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
                    <input type="file" id="photoId" name="photoId" accept=".pdf, .jpg, .jpeg, .png" onChange={handlePhotoIdChange} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </>

    );
};

export default Form;

import React, { useState, useEffect } from 'react';
import './User.css'; // Import the CSS file

const User = (props) => {
    const [users, setUsers] = useState([]);

    async function fetchUsers() {
        try {
            var response = await fetch(`/api/user`);
            if ('caches' in window) {
                let cache = await caches.open('my-cache');
                await cache.put('/api/user', response.clone());
                console.log('Catch updated.');
            }
            var userRes = await response.json();
            setUsers(userRes) 
        }
        catch(error) {
            console.error('Error fetching users from network:', error);
        }
    }

    useEffect(() => {
        fetchUsers();
        // fetch('/api/user/').then(res=>res.json()).then(data=>setUsers(data)).catch(error=>console.error('Error fetching users:', error));
    }, []);

    return (
        <div className="all-users">
            <h1>List of Users</h1>
            <div className="user-list">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <img src={user.Photo_Id} alt="User" className="user-avatar" />
                        <h2>{user.Name}</h2>
                        <p className="user-contact">Contact: {user.Contact}</p>
                        <p className="user-email">Email: {user.Email}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default User;

import React, { useState, useEffect } from 'react';
import './User.css'; // Import the CSS file

const User = (props) => {
    const [users, setUsers] = useState([]);

    function fetchUsers() {
        fetch('http://localhost:3001/user/')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }

    useEffect(() => {
        // Fetch user data from the API
        fetchUsers();
    }, []);

    return (
        <div className="all-users">
            <h1>All Users</h1>
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
    );
};

export default User;

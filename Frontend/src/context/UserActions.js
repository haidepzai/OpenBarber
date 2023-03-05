import axios from "axios";

export const getUserById = async (id) => {
    const userResponse = await fetch(`http://localhost:8080/api/users/${id}`);
    const userData = await userResponse.json();
    return userData;
}

export const updateUser = async (id, user) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/users/${id}`, JSON.stringify(user), {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('tokenJWT')}`
            },
        });
        return response;
    } catch (err) {
        throw new Error("Something went wrong");
    }
}
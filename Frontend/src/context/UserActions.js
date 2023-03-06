import axios from "axios";

export const getUserById = async (id) => {
    try {
        const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`);
        const userData = await userResponse.json();
        return userData;
    } catch (err) {
        throw new Error("Could not get user");
    }

}

export const updateUser = async (id, user) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, JSON.stringify(user), {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        });
        return response;
    } catch (err) {
        throw new Error("Could not update user");
    }
}

export const getUserByToken = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/info/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        });
        return response;
    } catch (err) {
        throw new Error("Could not find user");
    }
}
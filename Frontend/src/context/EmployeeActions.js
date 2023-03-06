import axios from "axios";


const employeeUrl = `${process.env.REACT_APP_BACKEND_URL}/employees/`;

export const deleteEmployeeById = async (id) => {
    try {
        const response = await axios.delete(`${employeeUrl}${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
        return response;
    } catch (err) {
        throw new Error("Could not delete employee");
    }    
}
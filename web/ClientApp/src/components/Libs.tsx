import axios from 'axios';

const token = localStorage["authToken"]
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

async function checkAuthentication(): Promise<boolean> {

    try {

        const response = await axios.post('/api/Auth/IsAuthenticated');
        return response.data.isAuthenticated;

    } catch (error) {

        return false;

    }
}

export default {
    checkAuthentication
};
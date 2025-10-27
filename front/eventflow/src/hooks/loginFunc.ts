import axios from "axios";


export default async function userLogin(login: string, password: string): Promise<void> {
    
    
    try {
        const res = await axios.post(
            'http://localhost:5000/auth/login',
            { login, password },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const role = res.data.role;

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', role);

        if (role === 'admin') {
            window.location.href = '/dashbordEvent'
        } else {
            window.location.href = '/';
        }
        
    } catch (error: any) {
        const message = error.response?.data?.message || 'Falha no login';
        throw new Error(message);
    }
}


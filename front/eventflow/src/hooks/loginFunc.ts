import axios from "axios";

export default async function userLogin(login: string, password: string): Promise<void> {
    try {
        const res = await axios.post(
            'http://localhost:5000/login',
            { login, password },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // O backend retorna apenas a role (por segurança não retorna o token no JSON)
        const role = res.data.role;

        // Redirecionamento baseado na role
        if (role === 'admin') {
            window.location.href = '/dashbordEvent';
        } else {
            window.location.href = '/home';
        }
        
    } catch (error: any) {
        const message = error.response?.data?.message || 'Falha no login';
        throw new Error(message);
    }
}


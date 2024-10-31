import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../context/AuthProvider';
import axios from '../api/axios';

const Logout = () => {
    const { setAuth } = useContext(authContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/auth/logout', {});
            
            setAuth({}); 
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setAuth({});
            navigate('/login');
        }
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logout;
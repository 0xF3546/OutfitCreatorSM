import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const Logout = () => {

    document.title = "Logout";
    
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear();
        navigate('/login');
    })
    return (
        <>
        
        </>
    )
}
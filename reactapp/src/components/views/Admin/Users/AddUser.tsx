import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, isUserValid } from "../../../api/Utils";

export const AddUserView = () => {
    const [userData, setUserData] = useState<any>();
    
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            var ud = await getUserData();
            setUserData(ud);
            if (!isUserValid(ud)) {
                navigate('/login');
                return;
            }
            if (ud.permission < 800) {
                navigate('/');
                return;
            }
        }

        load();
    }, [navigate]);

    return(
        <>
        </>
    )
}
import { Route, Routes, useNavigate } from "react-router-dom"
import { EditProfileView } from "./EditProfile"
import { EditAccountView } from "./EditAccount";
import { UserPropInterface } from "../../../etc/UserPropInterface";

import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BlockIcon from '@mui/icons-material/Block';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Logout from "@mui/icons-material/Logout";

export const SettingsView = ({ user }: UserPropInterface) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<View user={user} />} />
                <Route path='profile' element={< EditProfileView user={user} />} />
                <Route path='account' element={< EditAccountView user={user} />} />
            </Routes>
        </>
    )
}

const View = ({ user }: UserPropInterface) => {
    document.title = "Settings";
    const navigate = useNavigate();

    const handleClick = (route: string) => {
        navigate(route);
    }

    return (
        <>
            <h1 className="text-4xl font-bold text-center my-4 dark:text-white">Settings</h1>
            <div className="md:flex md:justify-around">
                <div className="my-4 md:my-0">
                    <span className="text-xl font-semibold dark:text-white">Account & Privacy</span>
                    <button onClick={() => handleClick('account')} className="flex items-center justify-start mt-2 p-2 rounded-md bg-blue-100 dark:bg-gray-800 dark:text-white transition-all hover:scale-105">
                        <PrivacyTipIcon className="mr-2 text-blue-500" />
                        Account & Privacy
                    </button>
                    <button onClick={() => handleClick('profile')} className="flex items-center justify-start mt-2 p-2 rounded-md bg-blue-100 dark:bg-gray-800 dark:text-white transition-all hover:scale-105">
                        <AccountBoxIcon className="mr-2 text-blue-500" />
                        Public Profile
                    </button>
                    <button className="flex items-center justify-start mt-2 p-2 rounded-md bg-blue-100 dark:bg-gray-800 dark:text-white transition-all hover:scale-105">
                        <BlockIcon className="mr-2 text-blue-500" />
                        Blocked Profiles
                    </button>
                    <button onClick={() => handleClick('/logout')} className="flex items-center justify-start mt-2 p-2 rounded-md bg-blue-100 dark:bg-gray-800 dark:text-white transition-all hover:scale-105">
                        <Logout className="mr-2 text-red-800" />
                        Logout
                    </button>
                </div>
                <div className="my-4 md:my-0">
                    <span className="text-xl font-semibold dark:text-white">Creator</span>
                    <button onClick={() => handleClick('/creator/analytics')} className="flex items-center justify-start mt-2 p-2 rounded-md bg-blue-100 dark:bg-gray-800 dark:text-white transition-all hover:scale-105">
                        <AnalyticsIcon className="mr-2 text-blue-500" />
                        Analytics
                    </button>
                    <button onClick={() => handleClick('/creator/advertise')} className="flex items-center justify-start mt-2 p-2 rounded-md bg-blue-100 dark:bg-gray-800 dark:text-white transition-all hover:scale-105">
                        <AdsClickIcon className="mr-2 text-blue-500" />
                        Advertisement
                    </button>
                </div>
            </div>
        </>
    )
}
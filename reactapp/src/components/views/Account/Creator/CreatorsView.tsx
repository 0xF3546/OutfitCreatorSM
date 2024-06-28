import { Link, Route, Routes } from "react-router-dom"
import { AnalyticsView } from "./Analytics"
import { UserPropInterface } from "../../../etc/UserPropInterface"
import { Avatar } from "@mui/joy"
import { Advertise } from "./Advertise";

import AnalyticsIcon from '@mui/icons-material/Analytics';
import AdsClickIcon from '@mui/icons-material/AdsClick';

export const CreatorView = ({ user }: UserPropInterface) => {
    return (
        <Routes>
            <Route path="/" element={< View user={user} />} />
            <Route path="analytics" element={< AnalyticsView user={user} />} />
            <Route path="advertise" element={<Advertise user={user} />} />
        </Routes>
    )
}

const View = ({ user }: UserPropInterface) => {
    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                <Option
                    link={'analytics'}
                    icon={<AnalyticsIcon />}
                    text={"Analytics"}
                    description={"Beschreibung"}
                />
                <Option
                    link={'advertise'}
                    icon={<AdsClickIcon />}
                    text={"Advertisement"}
                    description={"Beschreibung"}
                />
            </div>
        </>
    )
}

const Option = ({ link, icon, text, description }: any) => {
    return (
        <>
            <Link to={link} className="flex gap-4 items-start rounded-lg bg-white dark:bg-gray-800 shadow-md p-4 transform hover:scale-105 transition-transform">
                <Avatar className="w-14 h-14 border">
                    {icon}
                </Avatar>
                <div className="grid gap-1">
                    <h3 className="font-semibold dark:text-gray-200">{text}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
            </Link>
        </>
    )
}
import { PageHeaderWithBackrouting } from "../../Utils";
import { UserPropInterface } from "../../../etc/UserPropInterface";

export const EditAccountView = ({ user }: UserPropInterface) => {
    document.title = "Account - Settings"
    
    return (
        <>
            <PageHeaderWithBackrouting routing="/settings">Account</PageHeaderWithBackrouting>
        </>
    )
}
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PageHeader, PageHeaderWithBackrouting } from "../Utils";
import { UserPropInterface } from "../../etc/UserPropInterface";

export const Analytics = ({ user }: UserPropInterface) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
        }

        load();
    }, [navigate]);
    return (
        <>
            <PageHeaderWithBackrouting 
                routing="creator"
            >
                {t('analytics')}
            </PageHeaderWithBackrouting>
            {user ? (
                <>

                </>
            ) : (
                <>
                </>
            )}
        </>
    );
}
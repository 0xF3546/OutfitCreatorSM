import { PageHeaderWithBackrouting } from "../../Utils";
import { UserPropInterface } from "../../../etc/UserPropInterface";
import { useEffect, useState } from "react";
import { formatNumber } from "../../../api/Utils";

const WithdrawModal = ({ onClose, onSave }: any) => {
    const [amount, setAmount] = useState(0);

    const withDraw = () => {
        onSave(amount);
    }

    const handleChange = (e: any) => {
        const newValue = e.target.value;
        if (newValue < 0) {
            setAmount(0);
            return;
        }
        setAmount(newValue);
    }

    return (
        <>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-gray-600">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-900 dark:text-white">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Withdraw money</h3>
                                </div>
                            </div>
                            <h3 className="mt-4 text-lg leading-6 font-medium text-gray-200">Amount:</h3>
                            <input type="number" value={amount} onChange={handleChange} className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 dark:text-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
                                Close
                            </button>
                            <button onClick={withDraw} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const AnalyticsView = ({ user }: UserPropInterface) => {
    document.title = "Analytics - Creator"
    const [stats, setStats] = useState<any>({ earnings: 340.5, spend: 642.39, affiliate: 574.34, balance: 1000, follower: 123, impressions: 382457, profit: 0 });
    const [profit, setProfit] = useState(0);
    const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
    useEffect(() => {
        var p: number = 0;
        p += stats.earnings;
        p -= stats.spend;
        p += stats.affiliate;
        setProfit(p);
    }, [stats]);

    const profitToFixed = () => {
        return profit.toFixed(2);
    }

    const openWithdrawModal = () => {
        setWithdrawModalOpen(true);
    }

    const closeWithdrawModal = () => {
        setWithdrawModalOpen(false);
    }

    const withdrawAmount = (amount: number) => {
        if (amount < 0) {
            return;
        }
        if ((stats.balance - amount) < 0) {
            return;
        }
        if (amount === 0) {
            closeWithdrawModal();
            return;
        }
        setStats({ ...stats, balance: stats.balance - amount });
        closeWithdrawModal();
    }

    return (
        <>
            {isWithdrawModalOpen && (
                <>
                    <WithdrawModal
                        onClose={closeWithdrawModal}
                        onSave={withdrawAmount}
                    />
                </>
            )}
            <PageHeaderWithBackrouting
                routing="/creator"
            >
                Analytics
            </PageHeaderWithBackrouting>
            <div className={`${isWithdrawModalOpen && 'blur'} flex flex-col justify-center items-center h-[100vh] pt-4`}>
                <div className="min-w-[375px] md:min-w-[700px] xl:min-w-[800px] mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
                    <div className="relative flex flex-grow !flex-row items-center rounded-[10px] border-[1px] border-gray-200 bg-gray-800 bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-gray-700 dark:!bg-navy-800 dark:text-white dark:shadow-none hover:scale-105 transition-all max-md:mx-2">
                        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
                            <div className="rounded-full bg-gray-600 p-3 dark:bg-navy-700">
                                <span className="flex items-center text-brand-500 dark:text-white">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        stroke-width="0"
                                        viewBox="0 0 24 24"
                                        className="h-7 w-7"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path d="M4 9h4v11H4zM16 13h4v7h-4zM10 4h4v16h-4z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                            <p className="font-dm text-sm font-medium text-gray-200">Earnings</p>
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">${formatNumber(stats.earnings)}</h4>
                            <p className="text-green-500 text-xs">+${formatNumber(204.4)}</p>
                        </div>
                    </div>
                    <div className="relative flex flex-grow !flex-row items-center rounded-[10px] border-[1px] border-gray-200 bg-gray-800 bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-gray-700 dark:!bg-navy-800 dark:text-white dark:shadow-none hover:scale-105 transition-all max-md:mx-2">
                        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
                            <div className="rounded-full bg-gray-600 p-3 dark:bg-navy-700">
                                <span className="flex items-center text-brand-500 dark:text-white">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        stroke-width="0"
                                        viewBox="0 0 512 512"
                                        className="h-6 w-6"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M298.39 248a4 4 0 002.86-6.8l-78.4-79.72a4 4 0 00-6.85 2.81V236a12 12 0 0012 12z"></path>
                                        <path d="M197 267a43.67 43.67 0 01-13-31v-92h-72a64.19 64.19 0 00-64 64v224a64 64 0 0064 64h144a64 64 0 0064-64V280h-92a43.61 43.61 0 01-31-13zm175-147h70.39a4 4 0 002.86-6.8l-78.4-79.72a4 4 0 00-6.85 2.81V108a12 12 0 0012 12z"></path>
                                        <path d="M372 152a44.34 44.34 0 01-44-44V16H220a60.07 60.07 0 00-60 60v36h42.12A40.81 40.81 0 01231 124.14l109.16 111a41.11 41.11 0 0111.83 29V400h53.05c32.51 0 58.95-26.92 58.95-60V152z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                            <p className="font-dm text-sm font-medium text-gray-200">Spend this month</p>
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">${formatNumber(stats.spend)}</h4>
                        </div>
                    </div>
                    <div className="relative flex flex-grow !flex-row items-center rounded-[10px] border-[1px] border-gray-200 bg-gray-800 bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-gray-700 dark:!bg-navy-800 dark:text-white dark:shadow-none hover:scale-105 transition-all max-md:mx-2">
                        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
                            <div className="rounded-full bg-gray-600 p-3 dark:bg-navy-700">
                                <span className="flex items-center text-brand-500 dark:text-white">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        stroke-width="0"
                                        viewBox="0 0 24 24"
                                        className="h-7 w-7"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path d="M4 9h4v11H4zM16 13h4v7h-4zM10 4h4v16h-4z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                            <p className="font-dm text-sm font-medium text-gray-200">Affiliate Profit</p>
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">${formatNumber(stats.affiliate)}</h4>
                        </div>
                    </div>
                    <button onClick={openWithdrawModal} className="hover:cursor-pointer relative flex flex-grow !flex-row items-center rounded-[10px] border-[1px] border-gray-200 bg-gray-800 bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-gray-700 dark:!bg-navy-800 dark:text-white dark:shadow-none hover:scale-105 transition-all max-md:mx-2">
                        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
                            <div className="rounded-full bg-gray-600 p-3 dark:bg-navy-700">
                                <span className="flex items-center text-brand-500 dark:text-white">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        stroke-width="0"
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                            <p className="font-dm text-sm font-medium text-gray-200">Your Balance</p>
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">${formatNumber(stats.balance)}</h4>
                        </div>
                    </button>
                    <div className="relative flex flex-grow !flex-row items-center rounded-[10px] border-[1px] border-gray-200 bg-gray-800 bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-gray-700 dark:!bg-navy-800 dark:text-white dark:shadow-none hover:scale-105 transition-all max-md:mx-2">
                        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
                            <div className="rounded-full bg-gray-600 p-3 dark:bg-navy-700">
                                <span className="flex items-center text-brand-500 dark:text-white">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        stroke-width="0"
                                        viewBox="0 0 24 24"
                                        className="h-7 w-7"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path d="M4 9h4v11H4zM16 13h4v7h-4zM10 4h4v16h-4z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                            <p className="font-dm text-sm font-medium text-gray-200">Follower</p>
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">{formatNumber(stats.follower)}</h4>
                            <p className="text-green-500 text-xs">+{formatNumber(25)}</p>
                        </div>
                    </div>
                    <div className="relative flex flex-grow !flex-row items-center rounded-[10px] border-[1px] border-gray-200 bg-gray-800 bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-gray-700 dark:!bg-navy-800 dark:text-white dark:shadow-none hover:scale-105 transition-all max-md:mx-2">
                        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
                            <div className="rounded-full bg-gray-600 p-3 dark:bg-navy-700">
                                <span className="flex items-center text-brand-500 dark:text-white">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        stroke-width="0"
                                        viewBox="0 0 512 512"
                                        className="h-6 w-6"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M208 448V320h96v128h97.6V256H464L256 64 48 256h62.4v192z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                            <p className="font-dm text-sm font-medium text-gray-200">Impressions</p>
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">{formatNumber(stats.impressions)}</h4>
                            <p className="text-green-500 text-xs">+{formatNumber(133854)}</p>
                        </div>
                    </div>
                </div>
                <p className="font-normal text-gray-200 mt-20 mx-auto w-max">Total Profit: {<span className={`${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{`${profit >= 0 ? "+" : ''}${formatNumber(parseFloat(profitToFixed()))}$`}</span>}</p>
            </div>
        </>
    )
}
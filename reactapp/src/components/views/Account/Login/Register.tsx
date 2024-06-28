import { useState } from 'react';
import '../../../../index.css';
import { server } from '../../../../App';
import { Link, useNavigate } from 'react-router-dom';

let Register = () => {

    document.title = "Register";

    const [form, setForm] = useState({ userName: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    let handleRegister = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        await fetch(`${server}/account/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: "cors",
            body: JSON.stringify(form),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/');
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                } else {
                    throw new TypeError("Could not find user or Password is invalid.");
                }
            })
            .then((data) => {
                setForm({ userName: '', email: '', password: '', confirmPassword: '' });
                navigate('/');
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => setLoading(false));
    };

    const handleInputChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <section className="flex flex-col md:flex-row h-screen items-center">

            <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                <img src="https://source.unsplash.com/random" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
        flex items-center justify-center">

                <div className="w-full h-100">
                    {errorMessage && (
                        <div className={`w-full px-4 py-3 rounded-lg mt-2 text-gray-200 border ${errorMessage && 'bg-red-600'}`}>
                            {errorMessage && (errorMessage)}
                        </div>
                    )}

                    <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Register account</h1>

                    <form className="mt-6" action="#" method="POST">

                        <div>
                            <label className="block text-gray-700">Username</label>
                            <input disabled={isLoading} value={form.userName} onChange={handleInputChange} type="text" name="userName" id="username" placeholder="Enter Username" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus autoComplete='' required />
                        </div>

                        <div>
                            <label className="block text-gray-700">Email Address</label>
                            <input disabled={isLoading} value={form.email} onChange={handleInputChange} type="email" name="email" id="email" placeholder="Enter Email Address" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus autoComplete='' required />
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700">Password</label>
                            <input disabled={isLoading} value={form.password} onChange={handleInputChange} type="password" name="password" id="password" placeholder="Enter Password" minLength={6} className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                focus:bg-white focus:outline-none" required />
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700">Confirm Password</label>
                            <input disabled={isLoading} value={form.confirmPassword} onChange={handleInputChange} type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" minLength={6} className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                focus:bg-white focus:outline-none" required />
                        </div>

                        <button disabled={isLoading} type="submit" className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
              px-4 py-3 mt-6" onClick={handleRegister}>Register</button>
                    </form>

                    <hr className="my-6 border-gray-300 w-full" />

                    <button type="button" className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300">
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-6 h-6" viewBox="0 0 48 48"><defs><path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" /></defs><clipPath id="b"><use xlinkHref="#a" overflow="visible" /></clipPath><path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" /><path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" /><path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" /><path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" /></svg>
                            <span className="ml-4">
                                Log in
                                with
                                Google</span>
                        </div>
                    </button>

                    <p className="mt-8">Already have an account? <Link to={"/login"} className="text-blue-500 hover:text-blue-700 font-semibold">Log in
                    </Link>
                    </p>
                </div>
            </div>

        </section>
    );


};

export default Register;
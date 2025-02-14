import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import i18next from 'i18next';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [flag, setFlag] = useState(themeConfig.locale);

    useEffect(() => {
        dispatch(setPageTitle('Login'));
    }, [dispatch]);

    const handleLocaleChange = (lang: string) => {
        setFlag(lang);
        dispatch(toggleRTL(lang === 'ae' ? 'rtl' : 'ltr'));
        i18next.changeLanguage(lang);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="relative w-full max-w-4xl flex flex-col md:flex-row bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="hidden md:flex w-2/3 bg-blue-500 text-white items-center justify-center p-10 rounded-br-[50%] relative">
                    <div className="text-center">
                        <img src="..\public\assets\images\logo.svg" alt="Logo" className="mx-auto mb-4 w-32" />
                        <h1 className="text-3xl font-bold">FourWebs CRM</h1>
                        <p className="text-lg mt-2">Gerencie seu negócio com facilidade</p>
                    </div>
                </div>
                <div className="w-full md:w-1/3 p-8 flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Entrar</h1>
                    <form className="w-full mt-6" onSubmit={submitForm}>
                        <div className="relative mt-4">
                            <input id="email" type="email" required className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email" />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"><IconMail /></span>
                        </div>
                        <div className="relative mt-4">
                            <input id="password" type="password" required className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Senha" />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"><IconLockDots /></span>
                        </div>
                        <button type="submit" className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">Entrar</button>
                    </form>
                    <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} FourWebs CRM. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

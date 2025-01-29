import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconUser  from '../../components/Icon/IconUser';
import IconLock from '../../components/Icon/IconLock';

const AccountSetting = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle(''));
    }, [dispatch]);

    const [tabs, setTabs] = useState<string>('profile');
    const [profilePicture, setProfilePicture] = useState<string>('/assets/images/default-profile.png'); // URL da imagem padrão
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        position: '',
    });

    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="container mx-auto px-4">
            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5>
                </div>
                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5">
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('profile')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'profile' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconUser  />
                                Profile
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('password')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'password' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconLock />
                                Change Password
                            </button>
                        </li>
                    </ul>
                </div>

                {tabs === 'profile' && (
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                        <h6 className="text-lg font-bold mb-5">Edit Profile</h6>
                        <div className="flex flex-col sm:flex-row">
                            <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto mb-2" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="form-input mb-2"
                                />
                            </div>
                            
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input h-12 text-lg" // Aumentando a altura e o tamanho do texto
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input h-12 text-lg" // Aumentando a altura e o tamanho do texto
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input h-12 text-lg" // Aumentando a altura e o tamanho do texto
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address">Address</label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder="Enter your address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="form-input h-12 text-lg" // Aumentando a altura e o tamanho do texto
                                    />
                                </div>
                                <div>
                                    <label htmlFor="company">Company</label>
                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        placeholder="Enter your company name"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="form-input h-12 text-lg" // Aumentando a altura e o tamanho do texto
                                    />
                                </div>
                                <div>
                                    <label htmlFor="position">Position</label>
                                    <input
                                        id="position"
                                        name="position"
                                        type="text"
                                        placeholder="Enter your position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        className="form-input h-12 text-lg" // Aumentando a altura e o tamanho do texto
                                    />
                                </div>
                                <div className="sm:col-span-2 mt-3">
                                    <button type="button" className="btn btn-primary h-12 text-lg">Save Changes</button> {/* Aumentando a altura e o tamanho do texto */}
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {tabs === 'password' && (
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                        <h6 className="text-lg font-bold mb-5">Change Password</h6>
                        <div className="flex flex-col">
                            <div className="mb-4">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input id="currentPassword" type="password" placeholder="Enter current password" className="form-input h-12 text-lg" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newPassword">New Password</label>
                                <input id="newPassword" type="password" placeholder="Enter new password" className="form-input h-12 text-lg" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input id="confirmPassword" type="password" placeholder="Confirm new password" className="form-input h-12 text-lg" />
                            </div>
                            <button type="button" className="btn btn-primary h-12 text-lg">Change Password</button> {/* Aumentando a altura e o tamanho do texto */}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AccountSetting;
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconUser from '../../components/Icon/IconUser';
import IconLock from '../../components/Icon/IconLock';
import { Editor } from '@tinymce/tinymce-react';

const AccountSetting = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Account Settings'));
  }, [dispatch]);

  const [tabs, setTabs] = useState<string>('profile');
  const [profilePicture, setProfilePicture] = useState<string>('/assets/images/default-profile.png');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    position: '',
    emailSignature: '',
  });

  // Dummy dates para exibição; substitua pelos dados reais se necessário.
  const [profileDates] = useState({
    createdAt: '2021-01-01',
    updatedAt: '2021-06-01',
  });

  // Referência para o input de arquivo oculto.
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleEditorChange = (content: string) => {
    setFormData((prevData) => ({ ...prevData, emailSignature: content }));
  };

  return (
    <div className="container max-w-4xl mx-auto px-4">
      <div className="pt-5">
        <div className="flex items-center justify-between mb-5">
          <h5 className="font-semibold text-lg dark:text-white-light">Account Settings</h5>
        </div>
        <div>
          <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5">
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('profile')}
                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${
                  tabs === 'profile' ? '!border-primary text-primary' : ''
                }`}
              >
                <IconUser />
                Profile
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('password')}
                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${
                  tabs === 'password' ? '!border-primary text-primary' : ''
                }`}
              >
                <IconLock />
                Change Password
              </button>
            </li>
          </ul>
        </div>

        {tabs === 'profile' && (
          <form className="space-y-6 mb-5">

            
            {/* Seção: Imagem de Perfil e Datas */}
            <section className="p-4 border border-[#ebedf2] dark:border-[#191e3a] rounded-md bg-white dark:bg-black">
              <h6 className="text-lg font-bold mb-4">Imagem de Perfil</h6>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center justify-items-center">
            {/* Coluna 1: Foto e Botão de Upload */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {/* Input de arquivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button type="button" onClick={() => fileInputRef.current?.click()}>
                Alterar imagem
              </button>
            </div>
            {/* Coluna 2: Datas de Criação e Modificação */}
            <div className="space-y-2 text-left">
              <div>
                <span className="font-semibold">Data de Criação:</span>
                <p>{profileDates.createdAt}</p>
              </div>
              <div>
                <span className="font-semibold">Última Modificação:</span>
                <p>{profileDates.updatedAt}</p>
              </div>
            </div>
              </div>
            </section>

            {/* Seção: Informações Pessoais */}
            <section className="p-4 border border-[#ebedf2] dark:border-[#191e3a] rounded-md bg-white dark:bg-black">
              <h6 className="text-lg font-bold mb-4">Informações Pessoais</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="form-input h-12 text-lg w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="form-input h-12 text-lg w-full"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="form-input h-12 text-lg w-full"
              />
            </div>
            <div>
              <label htmlFor="address" className="block mb-1">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                className="form-input h-12 text-lg w-full"
              />
            </div>
            <div>
              <label htmlFor="company" className="block mb-1">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={handleChange}
                className="form-input h-12 text-lg w-full"
              />
            </div>
            <div>
              <label htmlFor="position" className="block mb-1">
                Position
              </label>
              <input
                id="position"
                name="position"
                type="text"
                placeholder="Enter your position"
                value={formData.position}
                onChange={handleChange}
                className="form-input h-12 text-lg w-full"
              />
            </div>
              </div>
            </section>


            {/* Seção: Assinatura de Email */}
            <section className="p-4 border border-[#ebedf2] dark:border-[#191e3a] rounded-md bg-white dark:bg-black">
              <h6 className="text-lg font-bold mb-4">Assinatura de Email</h6>
              <Editor
                apiKey="ki58rpmcaou2crprk7fwp9r4br6zbhmxnpk3hcgixisrm6c2"
                value={formData.emailSignature}
                init={{
                  height: 250,
                  menubar: false,
                  plugins: ['link', 'image', 'code', 'lists'],
                  toolbar:
                    'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code',
                }}
                onEditorChange={handleEditorChange}
              />
            </section>

            <div className="flex justify-end">
              <button type="button" className="btn btn-primary h-12 text-lg">
                Save Changes
              </button>
            </div>
          </form>
        )}

        {tabs === 'password' && (
          <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
            <h6 className="text-lg font-bold mb-5">Change Password</h6>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="currentPassword" className="block mb-1">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  className="form-input h-12 text-lg w-full"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="form-input h-12 text-lg w-full"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="form-input h-12 text-lg w-full"
                />
              </div>
              <button type="button" className="btn btn-primary h-12 text-lg w-full">
                Change Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountSetting;

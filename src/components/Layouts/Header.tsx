import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleTheme } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import IconCalendar from '../Icon/IconCalendar';
import IconEdit from '../Icon/IconEdit';
import IconSearch from '../Icon/IconSearch';
import IconXCircle from '../Icon/IconXCircle';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconInfoCircle from '../Icon/IconInfoCircle';
import IconBellBing from '../Icon/IconBellBing';
import IconUser from '../Icon/IconUser';
import IconLogout from '../Icon/IconLogout';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconCaretDown from '../Icon/IconCaretDown';
import IconSettings from '../Icon/IconSettings';

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Configurações de RTL e tema
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  // Estado das mensagens (exemplo)
  const [messages, setMessages] = useState([
    {
      id: 1,
      image:
        '<span className="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
      title: 'Congratulations!',
      message: 'Your OS has been updated.',
      time: '1hr',
    },
  ]);

  const removeMessage = (value: number) => {
    setMessages(messages.filter((user) => user.id !== value));
  };

  // Estado das notificações (exemplo)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      profile: 'user-profile.jpeg',
      message:
        '<strong className="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
      time: '45 min ago',
    },
  ]);

  const removeNotification = (value: number) => {
    setNotifications(notifications.filter((user) => user.id !== value));
  };

  // Estado da pesquisa (código comentado no exemplo)
  const [search, setSearch] = useState(false);

  return (
    <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
      <div className="shadow-sm">
        <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
            <Link to="/" className="main-logo flex items-center shrink-0">
              <img className="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo.svg" alt="logo" />
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle hidden md:inline dark:text-white-light transition-all duration-300">
                FourWeb CRM
              </span>
            </Link>
          </div>

          {/* Ícones de calendário e tarefas */}
          <div className="ltr:mr-2 rtl:ml-2 hidden sm:block">
            <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
              <li>
                <Link
                  to="/apps/calendar"
                  className="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                >
                  <IconCalendar />
                </Link>
              </li>
              <li>
                <Link
                  to="/apps/todolist"
                  className="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                >
                  <IconEdit />
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
            {/* Botão de pesquisa (código mantido comentado) */}
            <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
              {/*
              <form
                className={`${search && '!block'} sm:relative absolute inset-x-0 sm:top-0 top-1/2 sm:translate-y-0 -translate-y-1/2 sm:mx-0 mx-4 z-10 sm:block hidden`}
                onSubmit={() => setSearch(false)}
              >
                <div className="relative">
                  <input
                    type="text"
                    className="form-input ltr:pl-9 rtl:pr-9 ltr:sm:pr-4 rtl:sm:pl-4 ltr:pr-9 rtl:pl-9 peer sm:bg-transparent bg-gray-100 placeholder:tracking-widest"
                    placeholder="Pesquisa..."
                  />
                  <button type="button" className="absolute w-9 h-9 inset-0 ltr:right-auto rtl:left-auto appearance-none peer-focus:text-primary">
                    <IconSearch className="mx-auto" />
                  </button>
                  <button
                    type="button"
                    className="hover:opacity-80 sm:hidden block absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2"
                    onClick={() => setSearch(false)}
                  >
                    <IconXCircle />
                  </button>
                </div>
              </form>
              <button
                type="button"
                onClick={() => setSearch(!search)}
                className="search_btn sm:hidden p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
              >
                <IconSearch className="w-4.5 h-4.5 mx-auto dark:text-[#d0d2d6]" />
              </button>
              */}
            </div>

            <div>
              {/* Botão de Tema */}
              {themeConfig.theme === 'light' && (
                <button
                  className="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                  onClick={() => dispatch(toggleTheme('dark'))}
                >
                  <IconSun />
                </button>
              )}
              {themeConfig.theme === 'dark' && (
                <button
                  className="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                  onClick={() => dispatch(toggleTheme('system'))}
                >
                  <IconMoon />
                </button>
              )}
              {themeConfig.theme === 'system' && (
                <button
                  className="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                  onClick={() => dispatch(toggleTheme('light'))}
                >
                  <IconLaptop />
                </button>
              )}
            </div>

            <div className="dropdown shrink-0">
              {/* Botão de Notificações */}
              <Dropdown
                offset={[0, 8]}
                placement={isRtl ? 'bottom-start' : 'bottom-end'}
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  <span>
                    <IconBellBing />
                    <span className="flex absolute w-3 h-3 ltr:right-0 rtl:left-0 top-0">
                      <span className="animate-ping absolute ltr:-left-[3px] rtl:-right-[3px] -top-[3px] inline-flex h-full w-full rounded-full bg-success/50 opacity-75"></span>
                      <span className="relative inline-flex rounded-full w-[6px] h-[6px] bg-success"></span>
                    </span>
                  </span>
                }
              >
                <ul className="!py-0 text-dark dark:text-white-dark w-[300px] sm:w-[350px] divide-y dark:divide-white/10">
                  <li onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center px-4 py-2 justify-between font-semibold">
                      <h4 className="text-lg">Notification</h4>
                      {notifications.length ? (
                        <span className="badge bg-primary/80">{notifications.length}New</span>
                      ) : null}
                    </div>
                  </li>
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className="dark:text-white-light/90"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="group flex items-center px-4 py-2">
                            <div className="grid place-content-center rounded">
                              <div className="w-12 h-12 relative">
                                <img
                                  className="w-12 h-12 rounded-full object-cover"
                                  alt="profile"
                                  src={`/assets/images/${notification.profile}`}
                                />
                                <span className="bg-success w-2 h-2 rounded-full block absolute right-[6px] bottom-0"></span>
                              </div>
                            </div>
                            <div className="ltr:pl-3 rtl:pr-3 flex flex-auto">
                              <div className="ltr:pr-3 rtl:pl-3">
                                <h6
                                  dangerouslySetInnerHTML={{
                                    __html: notification.message,
                                  }}
                                ></h6>
                                <span className="text-xs block font-normal dark:text-gray-500">
                                  {notification.time}
                                </span>
                              </div>
                              <button
                                type="button"
                                className="ltr:ml-auto rtl:mr-auto text-neutral-300 hover:text-danger opacity-0 group-hover:opacity-100"
                                onClick={() => removeNotification(notification.id)}
                              >
                                <IconXCircle />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                      <li>
                        <div className="p-4">
                          <button className="btn btn-primary block w-full btn-small">
                            Read All Notifications
                          </button>
                        </div>
                      </li>
                    </>
                  ) : (
                    <li onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]"
                      >
                        <div className="mx-auto ring-4 ring-primary/30 rounded-full mb-4 text-primary">
                          <IconInfoCircle fill={true} className="w-10 h-10" />
                        </div>
                        No data available.
                      </button>
                    </li>
                  )}
                </ul>
              </Dropdown>
            </div>

            <div className="dropdown shrink-0 flex">
              {/* Botão com a foto do usuário */}
              <Dropdown
                offset={[0, 8]}
                placement={isRtl ? 'bottom-start' : 'bottom-end'}
                btnClassName="relative group block"
                button={
                  <img
                    className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                    src="/assets/images/user-profile.png"
                    alt="userProfile"
                  />
                }
              >
                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      <img
                        className="rounded-md w-10 h-10 object-cover"
                        src="/assets/images/user-profile.jpeg"
                        alt="userProfile"
                      />
                      <div className="ltr:pl-4 rtl:pr-4 truncate">
                        <h4 className="text-base">John Doe</h4>
                        <button
                          type="button"
                          className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                        >
                          johndoe@gmail.com
                        </button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link to="" className="dark:hover:text-white">
                      <IconEdit className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                      Conta
                    </Link>
                  </li>
                  <li>
                    <Link to="" className="dark:hover:text-white">
                      <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <Link to="" className="border-t border-white-light dark:border-white-light/10">
                      <IconSettings className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                      Configurações
                    </Link>
                  </li>
                  <li className="border-t border-white-light dark:border-white-light/10">
                    <Link to="" className="text-danger !py-3">
                      <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                      Sair
                    </Link>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Horizontal menu */}
        <ul className="horizontal-menu hidden py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse bg-white border-t border-[#ebedf2] dark:border-[#191e3a] dark:bg-black text-black dark:text-white-dark text-base">
          {/* Dashboard com submenu */}
          <li className="menu nav-item relative">
            <div
              className={`nav-link flex items-center justify-between cursor-pointer ${
                location.pathname.startsWith('/dashboard') ? 'active' : ''
              }`}
            >
              <div className="flex items-center">
                <IconMenuDashboard className="shrink-0" />
                <span className="px-1">{t('dashboard')}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </div>
            <ul className="sub-menu">
              <li>
                <NavLink to="/dashboard/" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {t('Inicial')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/vendas" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {t('Vendas')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/prospec" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {t('Prospecção')}
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Negociações */}
          <li className="menu nav-item relative">
            <NavLink
              to="/neg/board"
              className={({ isActive }) => 'nav-link flex items-center ' + (isActive ? 'active' : '')}
            >
              <span className="px-1">{t('Negociações')}</span>
            </NavLink>
          </li>

          {/* Empresas */}
          <li className="menu nav-item relative">
            <NavLink
              to="/comp/list"
              className={({ isActive }) => 'nav-link flex items-center ' + (isActive ? 'active' : '')}
            >
              <span className="px-1">{t('Empresas')}</span>
            </NavLink>
          </li>

          {/* Contatos */}
          <li className="menu nav-item relative">
            <NavLink
              to="/cont/list"
              className={({ isActive }) => 'nav-link flex items-center ' + (isActive ? 'active' : '')}
            >
              <span className="px-1">{t('Contatos')}</span>
            </NavLink>
          </li>

          {/* Tarefas */}
          <li className="menu nav-item relative">
            <NavLink
              to="/tsk/list"
              className={({ isActive }) => 'nav-link flex items-center ' + (isActive ? 'active' : '')}
            >
              <span className="px-1">{t('Tarefas')}</span>
            </NavLink>
          </li>

          {/* Relatórios com submenu */}
          <li className="menu nav-item relative">
            <div
              className={`nav-link flex items-center justify-between cursor-pointer ${
                location.pathname.startsWith('/relatorio') ? 'active' : ''
              }`}
            >
              <span className="px-1">{t('Relatórios')}</span>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </div>
            <ul className="sub-menu">
              <li>
                <NavLink to="/relatorio/vendas" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {t('Vendas')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/relatorio/negociacoes" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {t('Negociações')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/relatorio/empresas" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {t('Empresas')}
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;

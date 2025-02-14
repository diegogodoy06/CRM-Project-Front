import { useState, useEffect, Fragment } from 'react';
import Swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropdown from '../../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useNavigate } from "react-router-dom";

import IconListCheck from '../../components/Icon/IconListCheck';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconSearch from '../../components/Icon/IconSearch';
import IconMenu from '../../components/Icon/IconMenu';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconUser from '../../components/Icon/IconUser';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconX from '../../components/Icon/IconX';
import IconRestore from '../../components/Icon/IconRestore';
import IconChecks from '../../components/Icon/IconChecks';
import IconFilter from '../../components/Icon/IconFilter';
import IconStar from '../../components/Icon/IconStar';
import IconPlus from '../../components/Icon/IconPlus';


const NegociacoesList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle(''));
    });
    const defaultParams = {
        id: null,
        title: '',
        description: '',
        descriptionText: '',
        assignee: '',
        path: '',
        tag: '',
        priority: 'low',
    };

    const [selectedTab, setSelectedTab] = useState('');
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [viewTaskModal, setViewTaskModal] = useState(false);
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const [allTasks, setAllTasks] = useState([
        {
            id: 1,
            title: 'Meeting with Shaun Park at 4:50pm',
            date: 'Aug, 07 2020',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
            descriptionText:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
            tag: 'team',
            priority: 'medium',
            assignee: 'John Smith',
            path: '',
            status: '',
        },
    ]);

    const [filteredTasks, setFilteredTasks] = useState<any>(allTasks);
    const [pagedTasks, setPagedTasks] = useState<any>(filteredTasks);
    const [searchTask, setSearchTask] = useState<any>('');
    const [selectedTask, setSelectedTask] = useState<any>(defaultParams);
    const [isPriorityMenu] = useState<any>(null);
    const [isTagMenu] = useState<any>(null);

    const [pager] = useState<any>({
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
    });

    useEffect(() => {
        searchTasks();
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [selectedTab, searchTask, allTasks]);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const searchTasks = (isResetPage = true) => {
        if (isResetPage) {
            pager.currentPage = 1;
        }
        let res;
        if (selectedTab === 'complete' || selectedTab === 'important' || selectedTab === 'trash') {
            res = allTasks.filter((d) => d.status === selectedTab);
        } else {
            res = allTasks.filter((d) => d.status !== 'trash');
        }

        if (selectedTab === 'team' || selectedTab === 'update') {
            res = res.filter((d) => d.tag === selectedTab);
        } else if (selectedTab === 'high' || selectedTab === 'medium' || selectedTab === 'low') {
            res = res.filter((d) => d.priority === selectedTab);
        }
        setFilteredTasks([...res.filter((d: any) => d.title?.toLowerCase().includes(searchTask))]);
        getPager(res.filter((d: any) => d.title?.toLowerCase().includes(searchTask)));
    };

    const getPager = (res: any) => {
        setTimeout(() => {
            if (res.length) {
                pager.totalPages = pager.pageSize < 1 ? 1 : Math.ceil(res.length / pager.pageSize);
                if (pager.currentPage > pager.totalPages) {
                    pager.currentPage = 1;
                }
                pager.startIndex = (pager.currentPage - 1) * pager.pageSize;
                pager.endIndex = Math.min(pager.startIndex + pager.pageSize - 1, res.length - 1);
                setPagedTasks(res.slice(pager.startIndex, pager.endIndex + 1));
            } else {
                setPagedTasks([]);
                pager.startIndex = -1;
                pager.endIndex = -1;
            }
        });
    };

    const setPriority = (task: any, name: string = '') => {
        let item = filteredTasks.find((d: any) => d.id === task.id);
        item.priority = name;
        searchTasks(false);
    };

    const setTag = (task: any, name: string = '') => {
        let item = filteredTasks.find((d: any) => d.id === task.id);
        item.tag = name;
        searchTasks(false);
    };

    const tabChanged = () => {
        setIsShowTaskMenu(false);
    };

    const taskComplete = (task: any = null) => {
        let item = filteredTasks.find((d: any) => d.id === task.id);
        item.status = item.status === 'complete' ? '' : 'complete';
        searchTasks(false);
    };

    const setImportant = (task: any = null) => {
        let item = filteredTasks.find((d: any) => d.id === task.id);
        item.status = item.status === 'important' ? '' : 'important';
        searchTasks(false);
    };

    const viewTask = (item: any = null) => {
        setSelectedTask(item);
        setTimeout(() => {
            setViewTaskModal(true);
        });
    };

    const addEditTask = (task: any = null) => {
        setIsShowTaskMenu(false);
        let json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (task) {
            let json1 = JSON.parse(JSON.stringify(task));
            setParams(json1);
        }
        setAddTaskModal(true);
    };

    const deleteTask = (task: any, type: string = '') => {
        if (type === 'delete') {
            task.status = 'trash';
        }
        if (type === 'deletePermanent') {
            setAllTasks(allTasks.filter((d: any) => d.id !== task.id));
        } else if (type === 'restore') {
            task.status = '';
        }
        searchTasks(false);
    };

    const saveTask = () => {
        if (!params.title) {
            showMessage('Title is required.', 'error');
            return false;
        }
        if (params.id) {
            //update task
            setAllTasks(
                allTasks.map((d: any) => {
                    if (d.id === params.id) {
                        d = params;
                    }
                    return d;
                })
            );
        } else {
            //add task
            const maxId = allTasks?.length ? allTasks.reduce((max, obj) => (obj.id > max ? obj.id : max), allTasks[0].id) : 0;
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth());
            const yyyy = today.getFullYear();
            const monthNames: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let task = params;
            task.id = maxId + 1;
            task.date = monthNames[mm] + ', ' + dd + ' ' + yyyy;
            allTasks.unshift(task);
            searchTasks();
        }
        showMessage('Task has been saved successfully.');
        setAddTaskModal(false);
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isFilterModalOpen, setFilterModalOpen] = useState(false);

    const toggleFilterModal = () => {
        setFilterModalOpen(!isFilterModalOpen);
    };

    const [activeFilters, setActiveFilters] = useState(0);


    return (
        <div>
            {/* First Row */}
            <div className="flex justify-between items-center mb-4">

                <div className="relative inline-flex align-middle">
                    <button
                        type="button"
                        className={`btn btn-dark ltr:rounded-r-none rtl:rounded-l-none "btn-primary" : "btn-secondary"}`}
                        onClick={() => navigate("/neg/board")}
                    >
                        <IconChecks className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        className={`btn btn-dark ltr:rounded-l-none rtl:rounded-r-none "btn-primary" : "btn-secondary"}`}
                        onClick={() => navigate("/neg/list")}
                    >
                        <IconListCheck className="w-5 h-5" />
                    </button>
                </div>


                <div className="flex items-center gap-2">
                    <button type="button" className="btn btn-secondary">
                        <IconHorizontalDots className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                    //onClick={() => {
                    //    addEditProject();
                    //}}
                    >
                        <IconPlus className="w-5 h-5 ltr:mr-3 rtl:ml-3" />
                        Adicionar
                    </button>
                </div>
            </div>

            {/* Second Row */}
            <div className="flex gap-4 items-center px-4 border mb-4">

                <div className="flex items-center gap-2 p-1 rounded-md flex-1">
                    <label className="text-sm font-medium whitespace-nowrap flex items-center" style={{ marginBottom: "0px" }}>
                        Funil:
                    </label>
                    <select className="form-select text-white-dark">
                        <option value="">Funil Padrão</option>
                        <option value="categoria1">Categoria 1</option>
                        <option value="categoria2">Categoria 2</option>
                        <option value="categoria3">Categoria 3</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-md flex-1">
                    <label className="text-sm font-medium whitespace-nowrap flex items-center" style={{ marginBottom: "0px" }}>Responsável:</label>
                    <select className="form-select text-white-dark">
                        <option value="">Diego Alexandre</option>
                        <option value="categoria1">Categoria 1</option>
                        <option value="categoria2">Categoria 2</option>
                        <option value="categoria3">Categoria 3</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-md flex-1">
                    <label className="text-sm font-medium whitespace-nowrap flex items-center" style={{ marginBottom: "0px" }}>Status:</label>
                    <select className="form-select text-white-dark">
                        <option value="">Todos</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-md flex-1">
                    <label className="text-sm font-medium whitespace-nowrap flex items-center" style={{ marginBottom: "0px" }}>Ordem:</label>
                    <select className="form-select text-white-dark">
                        <option value="">Padrão</option>
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                        <option value="recentes">Mais Recentes</option>
                        <option value="antigos">Mais Antigos</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="btn btn-primary flex items-center"
                    onClick={toggleFilterModal}
                >
                    <IconFilter className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Filtrar ({activeFilters})
                </button>
            </div>

            {/* Modal Lateral de Filtragem */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="bg-gray-800 bg-opacity-50 flex-1"
                        onClick={toggleFilterModal}
                    ></div>
                    <div className="bg-white w-80 p-5 shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Filtrar Cards</h2>
                        <form>
                            {/* Dono do Card */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Dono</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Nome do dono"
                                />
                            </div>

                            {/* Status */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select className="select select-bordered w-full">
                                    <option value="">Selecione...</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>

                            {/* Ordem */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Ordenar por</label>
                                <select className="select select-bordered w-full">
                                    <option value="">Selecione...</option>
                                    <option value="a-z">A-Z</option>
                                    <option value="z-a">Z-A</option>
                                    <option value="recentes">Mais Recentes</option>
                                    <option value="antigos">Mais Antigos</option>
                                </select>
                            </div>

                            {/* Nome */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Nome</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Nome do card"
                                />
                            </div>

                            {/* Data de Criação */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Data de Criação</label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            {/* Empresa */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Empresa</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Nome da empresa"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                            >
                                Aplicar Filtros
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
                <div className={`overlay bg-black/60 z-[5] w-full h-full rounded-md absolute hidden ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div>

                <div className="panel p-0 flex-1 overflow-auto h-full">
                    <div className="flex flex-col h-full">
                        <div className="p-4 flex sm:flex-row flex-col w-full sm:items-center gap-4">
                            <div className="ltr:mr-3 rtl:ml-3 flex items-center">
                                <button type="button" className="xl:hidden hover:text-primary block ltr:mr-3 rtl:ml-3" onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}>
                                    <IconMenu />
                                </button>
                                <div className="relative group flex-1">
                                    <input
                                        type="text"
                                        className="form-input peer ltr:!pr-10 rtl:!pl-10"
                                        placeholder="Search Task..."
                                        value={searchTask}
                                        onChange={(e) => setSearchTask(e.target.value)}
                                        onKeyUp={() => searchTasks()}
                                    />
                                    <div className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                        <IconSearch />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center sm:justify-end sm:flex-auto flex-1">
                                <p className="ltr:mr-3 rtl:ml-3">{pager.startIndex + 1 + '-' + (pager.endIndex + 1) + ' of ' + filteredTasks.length}</p>
                                <button
                                    type="button"
                                    disabled={pager.currentPage === 1}
                                    className="bg-[#f4f4f4] rounded-md p-1 enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 ltr:mr-3 rtl:ml-3 disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => {
                                        pager.currentPage--;
                                        searchTasks(false);
                                    }}
                                >
                                    <IconCaretDown className="w-5 h-5 rtl:-rotate-90 rotate-90" />
                                </button>
                                <button
                                    type="button"
                                    disabled={pager.currentPage === pager.totalPages}
                                    className="bg-[#f4f4f4] rounded-md p-1 enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => {
                                        pager.currentPage++;
                                        searchTasks(false);
                                    }}
                                >
                                    <IconCaretDown className="w-5 h-5 rtl:rotate-90 -rotate-90" />
                                </button>
                            </div>
                        </div>
                        <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

                        {pagedTasks.length ? (
                            <div className="table-responsive grow overflow-y-auto sm:min-h-[300px] min-h-[400px]">
                                <table className="table-hover">
                                    <tbody>
                                        {pagedTasks.map((task: any) => {
                                            return (
                                                <tr className={`group cursor-pointer ${task.status === 'complete' ? 'bg-white-light/30 dark:bg-[#1a2941]' : ''}`} key={task.id}>
                                                    <td className="w-1">
                                                        <input
                                                            type="checkbox"
                                                            id={`chk-${task.id}`}
                                                            className="form-checkbox"
                                                            disabled={selectedTab === 'trash'}
                                                            onClick={() => taskComplete(task)}
                                                            defaultChecked={task.status === 'complete'}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div onClick={() => viewTask(task)}>
                                                            <div className={`group-hover:text-primary font-semibold text-base whitespace-nowrap ${task.status === 'complete' ? 'line-through' : ''}`}>
                                                                {task.title}
                                                            </div>
                                                            <div className={`text-white-dark overflow-hidden min-w-[300px] line-clamp-1 ${task.status === 'complete' ? 'line-through' : ''}`}>
                                                                {task.descriptionText}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="w-1">
                                                        <div className="flex items-center ltr:justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                                                            {task.priority && (
                                                                <div className="dropdown">
                                                                    <Dropdown
                                                                        offset={[0, 5]}
                                                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                                        btnClassName="align-middle"
                                                                        button={
                                                                            <span
                                                                                className={`badge rounded-full capitalize hover:top-0 hover:text-white ${task.priority === 'medium'
                                                                                    ? 'badge-outline-primary hover:bg-primary'
                                                                                    : task.priority === 'low'
                                                                                        ? 'badge-outline-warning hover:bg-warning'
                                                                                        : task.priority === 'high'
                                                                                            ? 'badge-outline-danger hover:bg-danger'
                                                                                            : task.priority === 'medium' && isPriorityMenu === task.id
                                                                                                ? 'text-white bg-primary'
                                                                                                : task.priority === 'low' && isPriorityMenu === task.id
                                                                                                    ? 'text-white bg-warning'
                                                                                                    : task.priority === 'high' && isPriorityMenu === task.id
                                                                                                        ? 'text-white bg-danger'
                                                                                                        : ''
                                                                                    }`}
                                                                            >
                                                                                {task.priority}
                                                                            </span>
                                                                        }
                                                                    >
                                                                        <ul className="text-sm text-medium">
                                                                            <li>
                                                                                <button
                                                                                    type="button"
                                                                                    className="w-full text-danger ltr:text-left rtl:text-right"
                                                                                    onClick={() => setPriority(task, 'high')}
                                                                                >
                                                                                    High
                                                                                </button>
                                                                            </li>
                                                                            <li>
                                                                                <button
                                                                                    type="button"
                                                                                    className="w-full text-primary ltr:text-left rtl:text-right"
                                                                                    onClick={() => setPriority(task, 'medium')}
                                                                                >
                                                                                    Medium
                                                                                </button>
                                                                            </li>
                                                                            <li>
                                                                                <button
                                                                                    type="button"
                                                                                    className="w-full text-warning ltr:text-left rtl:text-right"
                                                                                    onClick={() => setPriority(task, 'low')}
                                                                                >
                                                                                    Low
                                                                                </button>
                                                                            </li>
                                                                        </ul>
                                                                    </Dropdown>
                                                                </div>
                                                            )}

                                                            {task.tag && (
                                                                <div className="dropdown">
                                                                    <Dropdown
                                                                        offset={[0, 5]}
                                                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                                        btnClassName="align-middle"
                                                                        button={
                                                                            <span
                                                                                className={`badge rounded-full capitalize hover:top-0 hover:text-white ${task.tag === 'team'
                                                                                    ? 'badge-outline-success hover:bg-success'
                                                                                    : task.tag === 'update'
                                                                                        ? 'badge-outline-info hover:bg-info'
                                                                                        : task.tag === 'team' && isTagMenu === task.id
                                                                                            ? 'text-white bg-success '
                                                                                            : task.tag === 'update' && isTagMenu === task.id
                                                                                                ? 'text-white bg-info '
                                                                                                : ''
                                                                                    }`}
                                                                            >
                                                                                {task.tag}
                                                                            </span>
                                                                        }
                                                                    >
                                                                        <ul className="text-sm text-medium">
                                                                            <li>
                                                                                <button type="button" className="text-success" onClick={() => setTag(task, 'team')}>
                                                                                    Team
                                                                                </button>
                                                                            </li>
                                                                            <li>
                                                                                <button type="button" className="text-info" onClick={() => setTag(task, 'update')}>
                                                                                    Update
                                                                                </button>
                                                                            </li>
                                                                            <li>
                                                                                <button type="button" onClick={() => setTag(task, '')}>
                                                                                    None
                                                                                </button>
                                                                            </li>
                                                                        </ul>
                                                                    </Dropdown>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="w-1">
                                                        <p className={`whitespace-nowrap text-white-dark font-medium ${task.status === 'complete' ? 'line-through' : ''}`}>{task.date}</p>
                                                    </td>
                                                    <td className="w-1">
                                                        <div className="flex items-center justify-between w-max ltr:ml-auto rtl:mr-auto">
                                                            <div className="ltr:mr-2.5 rtl:ml-2.5 flex-shrink-0">
                                                                {task.path && (
                                                                    <div>
                                                                        <img src={`/assets/images/${task.path}`} className="h-8 w-8 rounded-full object-cover" alt="avatar" />
                                                                    </div>
                                                                )}
                                                                {!task.path && task.assignee ? (
                                                                    <div className="grid place-content-center h-8 w-8 rounded-full bg-primary text-white text-sm font-semibold">
                                                                        {task.assignee.charAt(0) + '' + task.assignee.charAt(task.assignee.indexOf(' ') + 1)}
                                                                    </div>
                                                                ) : (
                                                                    ''
                                                                )}
                                                                {!task.path && !task.assignee ? (
                                                                    <div className="border border-gray-300 dark:border-gray-800 rounded-full grid place-content-center h-8 w-8">
                                                                        <IconUser className="w-4.5 h-4.5" />
                                                                    </div>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </div>
                                                            <div className="dropdown">
                                                                <Dropdown
                                                                    offset={[0, 5]}
                                                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                                    btnClassName="align-middle"
                                                                    button={<IconHorizontalDots className="rotate-90 opacity-70" />}
                                                                >
                                                                    <ul className="whitespace-nowrap">
                                                                        {selectedTab !== 'trash' && (
                                                                            <>
                                                                                <li>
                                                                                    <button type="button" onClick={() => addEditTask(task)}>
                                                                                        <IconPencilPaper className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                                        Edit
                                                                                    </button>
                                                                                </li>
                                                                                <li>
                                                                                    <button type="button" onClick={() => deleteTask(task, 'delete')}>
                                                                                        <IconTrashLines className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                                        Delete
                                                                                    </button>
                                                                                </li>
                                                                                <li>
                                                                                    <button type="button" onClick={() => setImportant(task)}>
                                                                                        <IconStar className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                                        <span>{task.status === 'important' ? 'Not Important' : 'Important'}</span>
                                                                                    </button>
                                                                                </li>
                                                                            </>
                                                                        )}
                                                                        {selectedTab === 'trash' && (
                                                                            <>
                                                                                <li>
                                                                                    <button type="button" onClick={() => deleteTask(task, 'deletePermanent')}>
                                                                                        <IconTrashLines className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                                        Permanent Delete
                                                                                    </button>
                                                                                </li>
                                                                                <li>
                                                                                    <button type="button" onClick={() => deleteTask(task, 'restore')}>
                                                                                        <IconRestore className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                                        Restore Task
                                                                                    </button>
                                                                                </li>
                                                                            </>
                                                                        )}
                                                                    </ul>
                                                                </Dropdown>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center sm:min-h-[300px] min-h-[400px] font-semibold text-lg h-full">No data available</div>
                        )}
                    </div>
                </div>

                <Transition appear show={addTaskModal} as={Fragment}>
                    <Dialog as="div" open={addTaskModal} onClose={() => setAddTaskModal(false)} className="relative z-[51]">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[black]/60" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center px-4 py-8">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                        <button
                                            type="button"
                                            onClick={() => setAddTaskModal(false)}
                                            className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        >
                                            <IconX />
                                        </button>
                                        <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                            {params.id ? 'Edit Task' : 'Add Task'}
                                        </div>
                                        <div className="p-5">
                                            <form>
                                                <div className="mb-5">
                                                    <label htmlFor="title">Title</label>
                                                    <input id="title" type="text" placeholder="Enter Task Title" className="form-input" value={params.title} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="assignee">Assignee</label>
                                                    <select id="assignee" className="form-select" value={params.assignee} onChange={(e) => changeValue(e)}>
                                                        <option value="">Select Assignee</option>
                                                        <option value="John Smith">John Smith</option>
                                                        <option value="Kia Vega">Kia Vega</option>
                                                        <option value="Sandy Doe">Sandy Doe</option>
                                                        <option value="Jane Foster">Jane Foster</option>
                                                        <option value="Donna Frank">Donna Frank</option>
                                                    </select>
                                                </div>
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="tag">Tag</label>
                                                        <select id="tag" className="form-select" value={params.tag} onChange={(e) => changeValue(e)}>
                                                            <option value="">Select Tag</option>
                                                            <option value="team">Team</option>
                                                            <option value="update">Update</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="priority">Priority</label>
                                                        <select id="priority" className="form-select" value={params.priority} onChange={(e) => changeValue(e)}>
                                                            <option value="">Select Priority</option>
                                                            <option value="low">Low</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="high">High</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mb-5">
                                                    <label>Description</label>
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={params.description}
                                                        defaultValue={params.description}
                                                        onChange={(content, delta, source, editor) => {
                                                            params.description = content;
                                                            params.descriptionText = editor.getText();
                                                            setParams({
                                                                ...params,
                                                            });
                                                        }}
                                                        style={{ minHeight: '200px' }}
                                                    />
                                                </div>
                                                <div className="ltr:text-right rtl:text-left flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddTaskModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => saveTask()}>
                                                        {params.id ? 'Update' : 'Add'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                <Transition appear show={viewTaskModal} as={Fragment}>
                    <Dialog as="div" open={viewTaskModal} onClose={() => setViewTaskModal(false)} className="relative z-[51]">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[black]/60" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center px-4 py-8">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                        <button
                                            type="button"
                                            onClick={() => setViewTaskModal(false)}
                                            className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        >
                                            <IconX />
                                        </button>
                                        <div className="flex items-center flex-wrap gap-2 text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                            <div>{selectedTask.title}</div>
                                            {selectedTask.priority && (
                                                <div
                                                    className={`badge rounded-3xl capitalize ${selectedTask.priority === 'medium'
                                                        ? 'badge-outline-primary'
                                                        : selectedTask.priority === 'low'
                                                            ? 'badge-outline-warning '
                                                            : selectedTask.priority === 'high'
                                                                ? 'badge-outline-danger '
                                                                : ''
                                                        }`}
                                                >
                                                    {selectedTask.priority}
                                                </div>
                                            )}
                                            {selectedTask.tag && (
                                                <div
                                                    className={`badge rounded-3xl capitalize ${selectedTask.tag === 'team' ? 'badge-outline-success' : selectedTask.tag === 'update' ? 'badge-outline-info ' : ''
                                                        }`}
                                                >
                                                    {selectedTask.tag}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <div className="text-base prose" dangerouslySetInnerHTML={{ __html: selectedTask.description }}></div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setViewTaskModal(false)}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

        </div>
    );
};

export default NegociacoesList;

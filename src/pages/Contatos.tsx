import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { setPageTitle } from '../store/themeConfigSlice';
import { Button, Input, Select } from '@mantine/core';
import sortBy from 'lodash/sortBy';

const rowData = [
    {
        id: 1,
        firstName: 'Caroline',
        lastName: 'Jensen',
        email: 'carolinejensen@zidant.com',
        dob: '2004-05-28',
        address: {
            street: '529 Scholes Street',
            city: 'Temperanceville',
            zipcode: 5235,
            geo: {
                lat: 23.806115,
                lng: 164.677197,
            },
        },
        phone: '+1 (821) 447-3782',
        isActive: true,
        age: 39,
        company: 'POLARAX',
    }
];

const Contatos = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle(''));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'firstName'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const [selectedCompany, setSelectedCompany] = useState<string | null>('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const companies = [
        { id: '1', name: 'Empresa A' },
        { id: '2', name: 'Empresa B' },
        { id: '3', name: 'Empresa C' },
    ];

    // Função para filtrar os registros
    useEffect(() => {
        const filteredData = rowData.filter((record) => {
            return (
                (selectedCompany ? record.company === selectedCompany : true) &&
                (record.firstName.toLowerCase().includes(search.toLowerCase()) ||
                    record.lastName.toLowerCase().includes(search.toLowerCase()) ||
                    record.company.toLowerCase().includes(search.toLowerCase()) ||
                    record.email.toLowerCase().includes(search.toLowerCase()) ||
                    record.age.toString().toLowerCase().includes(search.toLowerCase()) ||
                    record.dob.toLowerCase().includes(search.toLowerCase()) ||
                    record.phone.toLowerCase().includes(search.toLowerCase()))
            );
        });
        setRecordsData(filteredData);
    }, [search, selectedCompany]);

    // Lógica de paginação
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(recordsData.slice(from, to));
    }, [page, pageSize, recordsData]);

    // Lógica de ordenação
    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    const handleImportClick = () => {
        console.log('Importar dados...');
        // Lógica de importação
    };

    const handleCreateContact = () => {
        console.log('Criar novo contato...');
        // Lógica para criar contato
    };

    const formatDate = (date: any) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    return (
        <div className="mx-auto p-4"> {/* add container caso queira que não fique em tela cheia */}
            {/* Filtros e Barra de Pesquisa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 mb-6">
                {/* Botões Importar e Criar Contato */}
                <div className="flex gap-2 justify-end items-center col-span-1 sm:col-span-2 lg:col-span-4">
                    <Button variant="outline" onClick={handleImportClick}>
                        Importar
                    </Button>
                    <Button className="btn btn-primary" onClick={handleCreateContact}>
                        Criar Contato
                    </Button>
                </div>

                {/* Filtro de Empresa */}
                <div className="flex items-center">
                    <Select
                        className="w-full"
                        value={selectedCompany}
                        onChange={setSelectedCompany}
                        placeholder="Todas as empresas"
                        data={[
                            { value: '', label: 'Todas as empresas' },
                            ...companies.map((company) => ({
                                value: company.id,
                                label: company.name,
                            })),
                        ]}
                    />
                </div>

                {/* Filtro de Empresa */}
                <div className="flex items-center">
                    <Select
                        className="w-full"
                        value={selectedCompany}
                        onChange={setSelectedCompany}
                        placeholder="Todas as empresas"
                        data={[
                            { value: '', label: 'Todas as empresas' },
                            ...companies.map((company) => ({
                                value: company.id,
                                label: company.name,
                            })),
                        ]}
                    />
                </div>

                <div className="flex items-center">
                    <Select
                        className="w-full"
                        value={selectedCompany}
                        onChange={setSelectedCompany}
                        placeholder="Todas as empresas"
                        data={[
                            { value: '', label: 'Todas as empresas' },
                            ...companies.map((company) => ({
                                value: company.id,
                                label: company.name,
                            })),
                        ]}
                    />
                </div>

                {/* Campo de Pesquisa */}
                <div className="flex gap-4 items-center">
                    <Input
                        className="flex-1"
                        placeholder="Pesquisar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button variant="outline" onClick={toggleFilterModal}>
                        Filtros Avançados
                    </Button>
                </div>

            </div>

            {/* Modal Lateral */}
            {
                isFilterModalOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Fundo escurecido */}
                        <div
                            className="bg-gray-800 bg-opacity-50 flex-1"
                            onClick={toggleFilterModal} // Fecha o modal ao clicar fora
                        ></div>

                        {/* Modal */}
                        <div className="bg-white w-80 p-5 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Filtrar Cards</h2>
                            <form>
                                {/* Dono do Card */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Dono</label>
                                    <Input
                                        type="text"
                                        className="w-full"
                                        placeholder="Nome do dono"
                                    />
                                </div>

                                {/* Status */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Status</label>
                                    <Select
                                        className="w-full"
                                        placeholder="Selecione..."
                                        data={[
                                            { value: 'ativo', label: 'Ativo' },
                                            { value: 'inativo', label: 'Inativo' },
                                        ]}
                                    />
                                </div>

                                {/* Ordem */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Ordenar por</label>
                                    <Select
                                        className="w-full"
                                        placeholder="Selecione..."
                                        data={[
                                            { value: 'a-z', label: 'A-Z' },
                                            { value: 'z-a', label: 'Z-A' },
                                            { value: 'recentes', label: 'Mais Recentes' },
                                            { value: 'antigos', label: 'Mais Antigos' },
                                        ]}
                                    />
                                </div>

                                {/* Nome */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Nome</label>
                                    <Input
                                        type="text"
                                        className="w-full"
                                        placeholder="Nome do card"
                                    />
                                </div>

                                {/* Data de Criação */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Data de Criação</label>
                                    <Input
                                        type="date"
                                        className="w-full"
                                    />
                                </div>

                                {/* Empresa */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Empresa</label>
                                    <Input
                                        type="text"
                                        className="w-full"
                                        placeholder="Nome da empresa"
                                    />
                                </div>

                                {/* Botão Aplicar Filtros */}
                                <Button className='btn btn-primary' fullWidth variant="filled">
                                    Aplicar Filtros
                                </Button>
                            </form>
                        </div>
                    </div>
                )
            }


            {/* Tabela */}
            <div className="panel datatables">
                <DataTable
                    highlightOnHover
                    className="whitespace-nowrap table-hover"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'firstName',
                            title: 'CONTATO',
                            sortable: true,
                            render: ({ firstName, lastName }) => (
                                <div>{firstName} {lastName}</div>
                            ),
                        },
                        { accessor: 'company', title: 'EMPRESA', sortable: true },
                        { accessor: 'email', title: 'EMAIL', sortable: true },
                        { accessor: 'phone', title: 'TELEFONE', sortable: true },
                        { accessor: 'age', title: 'IDADE', sortable: true },
                    ]}
                    totalRecords={recordsData.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Mostrando ${from} a ${to} de ${totalRecords} registros`}
                />
            </div>
        </div >
    );
};

export default Contatos;

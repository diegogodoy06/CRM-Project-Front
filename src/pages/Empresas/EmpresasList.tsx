import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Button, Input, Select } from '@mantine/core';
import sortBy from 'lodash/sortBy';
import IconFilter from '../../components/Icon/IconFilter';

const rowData = [
    {
        id: 1,
        name: 'Steelbras',
        cnpj: '12.345.678/0001-99',
        address: 'Av. Brasil, 123, São Paulo, SP',
        phone: '+55 (11) 99999-9999',
        isActive: true,
        createdAt: '2023-01-01',
    },
    {
        id: 2,
        name: 'Techcorp',
        cnpj: '98.765.432/0001-55',
        address: 'Rua das Flores, 456, Rio de Janeiro, RJ',
        phone: '+55 (21) 88888-8888',
        isActive: false,
        createdAt: '2022-10-10',
    },
];

const EmpresasList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Empresas'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'name'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });
    const [statusFilter, setStatusFilter] = useState<string | null>('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Função para filtrar os registros
    useEffect(() => {
        const filteredData = rowData.filter((record) => {
            return (
                (statusFilter ? (statusFilter === 'ativo' ? record.isActive : !record.isActive) : true) &&
                (record.name.toLowerCase().includes(search.toLowerCase()) ||
                    record.cnpj.includes(search) ||
                    record.phone.toLowerCase().includes(search.toLowerCase()))
            );
        });
        setRecordsData(filteredData);
    }, [search, statusFilter]);

    // Lógica de paginação
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);

    // Lógica de ordenação
    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus, initialRecords]);

    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    const handleImportClick = () => {
        console.log('Importar empresas...');
        // Lógica de importação
    };

    const handleCreateCompany = () => {
        console.log('Criar nova empresa...');
        // Lógica para criar empresa
    };

    const formatDate = (date: string) => {
        if (date) {
            const dt = new Date(date);
            return dt.toLocaleDateString('pt-BR');
        }
        return '';
    };

    const [activeFilters, setActiveFilters] = useState(0);

    return (
        <div>
            {/* Filtros e Barra de Pesquisa */}
            <div className="flex justify-between items-center mb-4">

                {/* Botões Importar e Criar Empresa */}
                <div className="flex items-center gap-2 ml-auto">
                    <Button variant="outline" onClick={handleImportClick}>
                        Importar
                    </Button>
                    <Button className="btn btn-primary" onClick={handleCreateCompany}>
                        Criar Empresa
                    </Button>
                </div>
            </div>

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


            {/* Modal Lateral */}
            {
                isFilterModalOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        <div
                            className="bg-gray-800 bg-opacity-50 flex-1"
                            onClick={toggleFilterModal}
                        ></div>
                        <div className="bg-white w-80 p-5 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Filtros Avançados</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">CNPJ</label>
                                    <Input type="text" className="w-full" placeholder="Digite o CNPJ" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
                                    <Input type="text" className="w-full" placeholder="Digite o nome" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Telefone</label>
                                    <Input type="text" className="w-full" placeholder="Telefone" />
                                </div>
                                <Button className="btn btn-primary" fullWidth variant="filled">
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
                        { accessor: 'name', title: 'NOME', sortable: true },
                        { accessor: 'cnpj', title: 'CNPJ', sortable: true },
                        { accessor: 'address', title: 'ENDEREÇO', sortable: true },
                        { accessor: 'phone', title: 'TELEFONE', sortable: true },
                        {
                            accessor: 'isActive',
                            title: 'STATUS',
                            render: ({ isActive }) => (isActive ? 'Ativo' : 'Inativo'),
                        },
                        {
                            accessor: 'createdAt',
                            title: 'DATA DE CRIAÇÃO',
                            render: ({ createdAt }) => formatDate(createdAt),
                        },
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
                    paginationText={({ from, to, totalRecords }) =>
                        `Mostrando ${from} a ${to} de ${totalRecords} registros`
                    }
                />
            </div>
        </div >
    );
};

export default EmpresasList;

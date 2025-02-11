import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { setPageTitle } from '../../store/themeConfigSlice';
import {
    Button,
    Input,
    Select,
    Drawer,
    TextInput,
    Group,
    Stack,
    Skeleton,
} from '@mantine/core';
import sortBy from 'lodash/sortBy';
import IconFilter from '../../components/Icon/IconFilter';

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
    },
];

const Contatos = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle(''));
    }, [dispatch]);

    /** Estados para listagem e filtros */
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords] = useState(sortBy(rowData, 'firstName'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [search, setSearch] = useState(''); // Pode ser utilizado no quick filter (por exemplo, para buscar nome)
    const [selectedCompany, setSelectedCompany] = useState<string | null>('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const [activeFilters] = useState(0);

    /** Estado de loading para a tabela (skeleton) */
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    /** Lista de empresas para os selects */
    const companies = [
        { id: '1', name: 'Empresa A' },
        { id: '2', name: 'Empresa B' },
        { id: '3', name: 'Empresa C' },
    ];

    /** Estados para o modal de cadastro de novo contato */
    const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
    const [nome, setNome] = useState('');
    const [cargo, setCargo] = useState('');
    const [empresaId, setEmpresaId] = useState('');
    const [telefone, setTelefone] = useState('');
    const [telefoneTipo, setTelefoneTipo] = useState('');

    const handleNewContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Aqui você pode realizar as validações e enviar os dados para a API
        console.log('Novo contato cadastrado:', {
            nome,
            cargo,
            empresaId,
            telefone,
            telefoneTipo,
        });

        // Após o cadastro, fecha o modal e limpa os campos
        setIsNewContactModalOpen(false);
        setNome('');
        setCargo('');
        setEmpresaId('');
        setTelefone('');
        setTelefoneTipo('');
    };

    /** Estados para o modal de filtragem */
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    /** Lógica de filtragem dos registros (pode ser adaptada conforme os filtros aplicados) */
    useEffect(() => {
        const filteredData = rowData.filter((record) => {
            return (
                (selectedCompany ? record.company === selectedCompany : true) &&
                (record.firstName.toLowerCase().includes(search.toLowerCase()) ||
                    record.lastName.toLowerCase().includes(search.toLowerCase()) ||
                    record.company.toLowerCase().includes(search.toLowerCase()) ||
                    record.email.toLowerCase().includes(search.toLowerCase()) ||
                    record.age.toString().includes(search.toLowerCase()) ||
                    record.dob.toLowerCase().includes(search.toLowerCase()) ||
                    record.phone.toLowerCase().includes(search.toLowerCase()))
            );
        });
        setRecordsData(filteredData);
    }, [search, selectedCompany]);

    /** Lógica de paginação */
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData((prevData) => prevData.slice(from, to));
    }, [page, pageSize]);

    /** Lógica de ordenação */
    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    /** Função para abrir o modal de cadastro */
    const handleCreateContact = () => {
        setIsNewContactModalOpen(true);
    };

    return (
        <div>
            {/* Botões de ação: Importar, Novo Contato e acesso ao modal de filtragem */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 ml-auto">
                    <Button variant="outline" onClick={() => console.log('Importar dados...')}>
                        Importar
                    </Button>
                    <Button className="btn btn-primary" onClick={handleCreateContact}>
                        Novo Contato
                    </Button>
                    { /* Botão de filtrar removido daqui */}
                </div>
            </div>

            {/* Linha de acesso rápido aos filtros */}
            <div className="flex gap-4 items-center px-4 border mb-4">
                {/* Funil */}
                <div className="flex items-center gap-2 p-1 rounded-md flex-1">
                    <label className="text-sm font-medium whitespace-nowrap">Funil:</label>
                    <select
                        className="form-select text-white-dark"
                        onChange={(e) => console.log('Funil selecionado:', e.currentTarget.value)}
                    >
                        <option value="">Funil Padrão</option>
                        <option value="categoria1">Categoria 1</option>
                        <option value="categoria2">Categoria 2</option>
                        <option value="categoria3">Categoria 3</option>
                    </select>
                </div>

                {/* Responsável */}
                <div className="flex items-center gap-2 p-2 rounded-md flex-1">
                    <label className="text-sm font-medium whitespace-nowrap">Responsável:</label>
                    <select
                        className="form-select text-white-dark"
                        onChange={(e) => console.log('Responsável:', e.currentTarget.value)}
                    >
                        <option value="">Diego Alexandre</option>
                        <option value="categoria1">Categoria 1</option>
                        <option value="categoria2">Categoria 2</option>
                        <option value="categoria3">Categoria 3</option>
                    </select>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 p-2 rounded-md flex-1">
                    <label className="text-sm font-medium whitespace-nowrap">Status:</label>
                    <select
                        className="form-select text-white-dark"
                        onChange={(e) => console.log('Status:', e.currentTarget.value)}
                    >
                        <option value="">Todos</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>

                {/* Ordem */}
                <div className="flex items-center gap-2 p-2 rounded-md flex-1">
                    <label className="text-sm font-medium whitespace-nowrap">Ordem:</label>
                    <select
                        className="form-select text-white-dark"
                        onChange={(e) => console.log('Ordem:', e.currentTarget.value)}
                    >
                        <option value="">Padrão</option>
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                        <option value="recentes">Mais Recentes</option>
                        <option value="antigos">Mais Antigos</option>
                    </select>
                </div>

                {/* Botão de Filtrar (novo na linha de acesso rápido aos filtros) */}
                <div>
                    <Button variant="outline" onClick={toggleFilterModal}>
                        <IconFilter className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        Filtrar ({activeFilters})
                    </Button>
                </div>
            </div>

            {/* Modal de filtragem (Drawer) com estilização aprimorada */}
            <Drawer
                opened={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                title={<h2 style={{ margin: 0 }}>Filtrar Contatos</h2>}
                padding="xl"
                size="md"
                position="right"
                overlayOpacity={0.55}
                overlayBlur={3}
                styles={{
                    drawer: { maxWidth: '400px', width: '100%' },
                    header: {
                        backgroundColor: '#f5f5f5',
                        padding: '1rem',
                        borderBottom: '1px solid #ddd',
                    },
                }}
            >
                <form>
                    <Stack spacing="md">
                        <TextInput label="Dono" placeholder="Nome do dono" />
                        <TextInput label="Responsável" placeholder="Nome do responsável" />
                        <Select
                            label="Status"
                            placeholder="Selecione..."
                            data={[
                                { value: 'todos', label: 'Todos' },
                                { value: 'ativo', label: 'Ativo' },
                                { value: 'inativo', label: 'Inativo' },
                            ]}
                        />
                        <Select
                            label="Funil"
                            placeholder="Selecione..."
                            data={[
                                { value: 'padrao', label: 'Funil Padrão' },
                                { value: 'categoria1', label: 'Categoria 1' },
                                { value: 'categoria2', label: 'Categoria 2' },
                                { value: 'categoria3', label: 'Categoria 3' },
                            ]}
                        />
                        <Select
                            label="Ordenar por"
                            placeholder="Selecione..."
                            data={[
                                { value: 'a-z', label: 'A-Z' },
                                { value: 'z-a', label: 'Z-A' },
                                { value: 'recentes', label: 'Mais Recentes' },
                                { value: 'antigos', label: 'Mais Antigos' },
                            ]}
                        />
                        <TextInput label="Nome" placeholder="Nome do contato" />
                        <TextInput label="Empresa" placeholder="Nome da empresa" />
                        <TextInput label="Data de Criação" type="date" />
                    </Stack>
                    <Group position="apart" mt="xl">
                        <Button variant="outline" onClick={() => setIsFilterModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Aplicar Filtros</Button>
                    </Group>
                </form>
            </Drawer>

            {/* Tabela de contatos com skeleton enquanto carrega */}
            <div className="panel datatables">
                {loading ? (
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th className="p-2">
                                    <Skeleton height={20} width={100} radius="md" />
                                </th>
                                <th className="p-2">
                                    <Skeleton height={20} width={100} radius="md" />
                                </th>
                                <th className="p-2">
                                    <Skeleton height={20} width={150} radius="md" />
                                </th>
                                <th className="p-2">
                                    <Skeleton height={20} width={100} radius="md" />
                                </th>
                                <th className="p-2">
                                    <Skeleton height={20} width={50} radius="md" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index}>
                                    <td className="p-2">
                                        <Skeleton height={20} width={100} radius="md" />
                                    </td>
                                    <td className="p-2">
                                        <Skeleton height={20} width={100} radius="md" />
                                    </td>
                                    <td className="p-2">
                                        <Skeleton height={20} width={150} radius="md" />
                                    </td>
                                    <td className="p-2">
                                        <Skeleton height={20} width={100} radius="md" />
                                    </td>
                                    <td className="p-2">
                                        <Skeleton height={20} width={50} radius="md" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
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
                                    <div>
                                        {firstName} {lastName}
                                    </div>
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
                        paginationText={({ from, to, totalRecords }) =>
                            `Mostrando ${from} a ${to} de ${totalRecords} registros`
                        }
                    />
                )}
            </div>

            {/* Drawer para cadastro de novo contato com estilização aprimorada */}
            <Drawer
                opened={isNewContactModalOpen}
                onClose={() => setIsNewContactModalOpen(false)}
                title={<h2 style={{ margin: 0 }}>Cadastrar Novo Contato</h2>}
                padding="xl"
                size="md"
                position="right"
                overlayOpacity={0.55}
                overlayBlur={3}
                styles={{
                    drawer: { maxWidth: '400px', width: '100%' },
                    header: {
                        backgroundColor: '#f5f5f5',
                        padding: '1rem',
                        borderBottom: '1px solid #ddd',
                    },
                }}
            >
                <form onSubmit={handleNewContactSubmit}>
                    <Stack spacing="md">
                        <TextInput
                            label="Nome"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.currentTarget.value)}
                            required
                        />
                        <TextInput
                            label="Cargo"
                            placeholder="Digite o cargo"
                            value={cargo}
                            onChange={(e) => setCargo(e.currentTarget.value)}
                        />
                        <Select
                            label="Empresa"
                            placeholder="Selecione a empresa"
                            data={companies.map((comp) => ({
                                value: comp.id,
                                label: comp.name,
                            }))}
                            value={empresaId}
                            onChange={(value) => setEmpresaId(value || '')}
                            required
                        />
                        <TextInput
                            label="Telefone"
                            placeholder="Digite o telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.currentTarget.value)}
                            required
                        />
                        <Select
                            label="Tipo de Telefone"
                            placeholder="Selecione o tipo"
                            data={[
                                { value: '1', label: 'Celular' },
                                { value: '2', label: 'Fixo' },
                                { value: '3', label: 'Comercial' },
                            ]}
                            value={telefoneTipo}
                            onChange={(value) => setTelefoneTipo(value || '')}
                            required
                        />
                    </Stack>
                    <Group position="apart" mt="xl">
                        <Button variant="outline" onClick={() => setIsNewContactModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Cadastrar</Button>
                    </Group>
                </form>
            </Drawer>
        </div>
    );
};

export default Contatos;

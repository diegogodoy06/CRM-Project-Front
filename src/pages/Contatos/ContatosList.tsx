import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { setPageTitle } from '../../store/themeConfigSlice';
import {
  Button,
  Select,
  Drawer,
  TextInput,
  Group,
  Stack,
  Skeleton,
  MultiSelect,
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
  const [search, setSearch] = useState('');
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
  const [email, setEmail] = useState('');
  const [empresaId, setEmpresaId] = useState('');

  // Estado para armazenar um ou mais telefones do novo contato
  const [phones, setPhones] = useState([{ type: '', number: '' }]);

  // Função que retorna o ícone de acordo com o tipo de telefone
  const getPhoneIcon = (type: string) => {
    switch (type) {
      case 'celular':
        return <span role="img" aria-label="celular">📱</span>;
      case 'fixo':
        return <span role="img" aria-label="fixo">☎️</span>;
      case 'comercial':
        return <span role="img" aria-label="comercial">🏢</span>;
      default:
        return <span role="img" aria-label="phone">📞</span>;
    }
  };

  // Atualiza o valor de um telefone (tipo ou número) conforme o índice
  const handlePhoneChange = (
    index: number,
    field: 'type' | 'number',
    value: string
  ) => {
    setPhones((prevPhones) => {
      const updatedPhones = [...prevPhones];
      updatedPhones[index] = { ...updatedPhones[index], [field]: value };
      return updatedPhones;
    });
  };

  // Adiciona um novo campo de telefone (limitado a 3)
  const handleAddPhone = () => {
    if (phones.length < 3) {
      setPhones((prevPhones) => [...prevPhones, { type: '', number: '' }]);
    }
  };

  const handleNewContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Aqui você pode realizar as validações e enviar os dados para a API
    console.log('Novo contato cadastrado:', {
      nome,
      cargo,
      phones, // array de telefones
      email,
      empresaId,
    });

    // Após o cadastro, fecha o modal e limpa os campos
    setIsNewContactModalOpen(false);
    setNome('');
    setCargo('');
    setEmail('');
    setEmpresaId('');
    setPhones([{ type: '', number: '' }]);
  };

  /** Estados para o modal de filtragem */
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  // Estados para os filtros
  const [filterEmptyFields, setFilterEmptyFields] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterCargo, setFilterCargo] = useState('');
  // Inicia com apenas UM campo de telefone
  const [filterPhones, setFilterPhones] = useState<string[]>(['']);
  const [filterCreationDate, setFilterCreationDate] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  const handleFilterPhoneChange = (index: number, value: string) => {
    setFilterPhones((prevPhones) => {
      const updatedPhones = [...prevPhones];
      updatedPhones[index] = value;
      return updatedPhones;
    });
  };

  const handleAddFilterPhone = () => {
    setFilterPhones((prevPhones) => [...prevPhones, '']);
  };

  const handleApplyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Aplicar filtros:', {
      filterEmptyFields,
      filterName,
      filterCargo,
      filterPhones,
      filterCreationDate,
      filterCompany,
    });
    // Aqui você pode atualizar os critérios de filtro da tabela
    setIsFilterModalOpen(false);
  };

  /** Lógica de filtragem dos registros (exemplo simplificado) */
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
          {/* Botão de Filtrar removido daqui */}
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

        {/* Botão de Filtrar */}
        <div>
          <Button variant="outline" onClick={toggleFilterModal}>
            <IconFilter className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            Filtrar ({activeFilters})
          </Button>
        </div>
      </div>

      {/* Modal de filtragem (Drawer) com footer fixo */}
      <Drawer
        opened={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title={<h1 style={{ margin: 0 }}>Filtrar Contatos</h1>}
        padding="xl"
        size="md"
        position="right"
        overlayOpacity={0.55}
        overlayBlur={0}
        styles={{
          drawer: { maxWidth: '400px', width: '100%' },
          header: {
            backgroundColor: '#fffff',
            padding: '1rem',
            borderBottom: '1px solid #ddd',
          },
          body: {
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 120px)',
            paddingBottom: '100px', // espaço para o rodapé fixo
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #e0e0e0',
          },
        }}
      >
        <form id="filterForm" onSubmit={handleApplyFilters}>
          <Stack spacing="md">
            <MultiSelect
              label="Campos Vazios"
              placeholder="Selecione as colunas"
              data={[
                { value: 'nome', label: 'Nome' },
                { value: 'cargo', label: 'Cargo' },
                { value: 'telefone', label: 'Telefone' },
                { value: 'dataCriacao', label: 'Data de Criação' },
                { value: 'empresa', label: 'Empresa' },
              ]}
              value={filterEmptyFields}
              onChange={setFilterEmptyFields}
            />
            <TextInput
              label="Filtrar por Nome"
              placeholder="Digite o nome"
              value={filterName}
              onChange={(e) => setFilterName(e.currentTarget.value)}
            />
            <TextInput
              label="Filtrar por Cargo"
              placeholder="Digite o cargo"
              value={filterCargo}
              onChange={(e) => setFilterCargo(e.currentTarget.value)}
            />
            <div>
              <label
                style={{
                  fontWeight: 500,
                  marginBottom: 4,
                  display: 'block',
                }}
              >
                Filtrar por Telefone
              </label>
              {filterPhones.map((phone, index) => (
                <TextInput
                  key={index}
                  placeholder="Digite o telefone"
                  value={phone}
                  onChange={(e) => handleFilterPhoneChange(index, e.currentTarget.value)}
                  style={{ marginBottom: 8 }}
                />
              ))}
              <Button variant="outline" mt={4} onClick={handleAddFilterPhone} compact>
                + Adicionar Telefone
              </Button>
            </div>
            <TextInput
              label="Data de Criação"
              placeholder="Selecione a data"
              type="date"
              value={filterCreationDate}
              onChange={(e) => setFilterCreationDate(e.currentTarget.value)}
            />
            <Select
              label="Empresa"
              placeholder="Selecione a empresa"
              searchable
              data={companies.map((comp) => ({
                value: comp.id,
                label: comp.name,
              }))}
              value={filterCompany}
              onChange={(value) => setFilterCompany(value || '')}
            />
          </Stack>
        </form>
        {/* Rodapé fixo no modal de filtragem */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            padding: '16px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            borderTop: '1px solid #ddd',
          }}
        >
          <Button variant="outline" onClick={() => setIsFilterModalOpen(false)}>
            Cancelar
          </Button>
          <Button className="btn btn-primary" type="submit" form="filterForm">
            Aplicar Filtro
          </Button>
        </div>
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

      {/* Modal para cadastro de novo contato (mantém o layout atualizado) */}
      <Drawer
        opened={isNewContactModalOpen}
        onClose={() => setIsNewContactModalOpen(false)}
        title={<h2 style={{ margin: 0 }}>Cadastrar Novo Contato</h2>}
        padding="xl"
        size="lg"
        position="right"
        overlayOpacity={0.55}
        overlayBlur={0}
        styles={{
          drawer: { maxWidth: '600px', width: '100%' },
          header: {
            backgroundColor: '#fffff',
            padding: '1rem',
            borderBottom: '1px solid #ddd',
          },
        }}
      >
        {/* O form recebe um padding inferior para dar espaço ao footer fixo */}
        <form
          id="newContactForm"
          onSubmit={handleNewContactSubmit}
          style={{ position: 'relative', paddingBottom: '80px' }}
        >
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

            {/* Campos de Telefone */}
            <div>
              <label
                style={{
                  fontWeight: 500,
                  marginBottom: 4,
                  display: 'block',
                }}
              >
                Telefone(s)
              </label>
              {phones.map((phone, index) => (
                <Group
                  key={index}
                  noWrap
                  align="flex-end"
                  style={{ marginBottom: 8 }}
                >
                  <Select
                    data={[
                      { value: 'celular', label: 'Celular' },
                      { value: 'fixo', label: 'Fixo' },
                      { value: 'comercial', label: 'Comercial' },
                    ]}
                    placeholder="Tipo"
                    value={phone.type}
                    onChange={(value) =>
                      handlePhoneChange(index, 'type', value || '')
                    }
                    icon={getPhoneIcon(phone.type)}
                    style={{ width: '30%' }}
                    required
                  />
                  <TextInput
                    placeholder="(99) 99999-9999"
                    value={phone.number}
                    onChange={(e) =>
                      handlePhoneChange(index, 'number', e.currentTarget.value)
                    }
                    pattern="\\(\\d{2}\\) \\d{5}-\\d{4}"
                    style={{ width: '70%' }}
                    required
                  />
                </Group>
              ))}
              {phones.length < 3 && (
                <Button variant="outline" mt={4} onClick={handleAddPhone} compact>
                  + Adicionar Telefone
                </Button>
              )}
            </div>

            <TextInput
              label="Email"
              placeholder="Digite o email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />

            <Select
              label="Empresa"
              placeholder="Selecione a empresa"
              searchable
              data={companies.map((comp) => ({
                value: comp.id,
                label: comp.name,
              }))}
              value={empresaId}
              onChange={(value) => setEmpresaId(value || '')}
              required
            />
          </Stack>

          {/* Botões fixos no canto inferior direito */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              gap: '8px',
            }}
          >
            <Button variant="outline" onClick={() => setIsNewContactModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="btn btn-primary" type="submit">
              Criar Contato
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Contatos;

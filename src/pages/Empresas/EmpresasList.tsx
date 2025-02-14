import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { setPageTitle } from '../../store/themeConfigSlice';
import {
  Button,
  TextInput,
  Select,
  Skeleton,
  Drawer,
  Textarea,
} from '@mantine/core';
import sortBy from 'lodash/sortBy';
import IconFilter from '../../components/Icon/IconFilter';

// Define a interface para a Empresa
interface Empresa {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

// Dados simulados para as empresas
const rowData: Empresa[] = [
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
  // Atualiza o título da página
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle(''));
  }, [dispatch]);

  // Estados para paginação
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  // Estados para armazenar os registros da tabela
  const [initialRecords, setInitialRecords] = useState<Empresa[]>([]);
  const [recordsData, setRecordsData] = useState<Empresa[]>([]);

  // Estados para controle de busca, ordenação e filtros
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'name',
    direction: 'asc',
  });
  const [statusFilter, setStatusFilter] = useState<string | null>('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Estado para gerenciar o carregamento dos dados
  const [loading, setLoading] = useState(true);

  // Estados para gerenciar o modal de criação de empresa
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Estados para os campos do formulário de criação
  const [empNome, setEmpNome] = useState('');
  const [empCPF, setEmpCPF] = useState('');
  const [empCNPJ, setEmpCNPJ] = useState('');
  const [empURL, setEmpURL] = useState('');
  const [empDescricao, setEmpDescricao] = useState('');
  const [cidEnderecoID, setCidEnderecoID] = useState('');

  // Simula a requisição dos dados com um delay de 2 segundos
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const sortedData = sortBy(rowData, 'name'); // Ordena os dados por nome
      setInitialRecords(sortedData);
      setRecordsData(sortedData);
      setLoading(false);
    }, 2000);
  }, []);

  // Aplica filtros de busca e status nos registros
  useEffect(() => {
    if (!loading) {
      const filteredData = rowData.filter((record) => {
        return (
          // Filtro pelo status, se definido
          (statusFilter
            ? statusFilter === 'ativo'
              ? record.isActive
              : !record.isActive
            : true) &&
          // Filtro de busca em nome, CNPJ ou telefone
          (record.name.toLowerCase().includes(search.toLowerCase()) ||
            record.cnpj.includes(search) ||
            record.phone.toLowerCase().includes(search.toLowerCase()))
        );
      });
      setRecordsData(filteredData);
    }
  }, [search, statusFilter, loading]);

  // Lógica de paginação
  useEffect(() => {
    if (!loading) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecordsData(initialRecords.slice(from, to));
    }
  }, [page, pageSize, initialRecords, loading]);

  // Lógica de ordenação
  useEffect(() => {
    if (!loading) {
      const data = sortBy(initialRecords, sortStatus.columnAccessor);
      setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
    }
  }, [sortStatus, initialRecords, loading]);

  // Alterna a visibilidade do modal de filtros avançados
  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  // Abre o modal de criação de empresa
  const handleCreateCompany = () => {
    setIsCreateModalOpen(true);
  };

  // Simula a importação de empresas
  const handleImportClick = () => {
    console.log('Importar empresas...');
    // Lógica de importação, se necessário
  };

  // Formata a data para o padrão pt-BR
  const formatDate = (date: string) => {
    if (date) {
      const dt = new Date(date);
      return dt.toLocaleDateString('pt-BR');
    }
    return '';
  };

  // Trata o envio do formulário de criação de empresa
  const handleSubmitCreateEmpresa = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados da nova empresa:', {
      empNome,
      empCPF,
      empCNPJ,
      empURL,
      empDescricao,
      cidEnderecoID,
    });
    // Após o envio, reseta os campos e fecha o modal
    setEmpNome('');
    setEmpCPF('');
    setEmpCNPJ('');
    setEmpURL('');
    setEmpDescricao('');
    setCidEnderecoID('');
    setIsCreateModalOpen(false);
  };

  return (
    <div>
      {/* Área de ações: Importar e Criar Empresa */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" onClick={handleImportClick}>
            Importar
          </Button>
          <Button className="btn btn-primary" onClick={handleCreateCompany}>
            Criar Empresa
          </Button>
        </div>
      </div>

      {/* Seção de filtros básicos */}
      <div className="flex gap-4 items-center px-4 border mb-4">
        {/* Filtro Funil */}
        <div className="flex items-center gap-2 p-1 rounded-md flex-1">
          <label className="text-sm font-medium whitespace-nowrap flex items-center" style={{ marginBottom: '0px' }}>
            Funil:
          </label>
          <select className="form-select text-white-dark">
            <option value="">Funil Padrão</option>
            <option value="categoria1">Categoria 1</option>
            <option value="categoria2">Categoria 2</option>
            <option value="categoria3">Categoria 3</option>
          </select>
        </div>

        {/* Filtro Responsável */}
        <div className="flex items-center gap-2 p-2 rounded-md flex-1">
          <label className="text-sm font-medium whitespace-nowrap flex items-center" style={{ marginBottom: '0px' }}>
            Responsável:
          </label>
          <select className="form-select text-white-dark">
            <option value="">Diego Alexandre</option>
            <option value="categoria1">Categoria 1</option>
            <option value="categoria2">Categoria 2</option>
            <option value="categoria3">Categoria 3</option>
          </select>
        </div>

        {/* Filtro Status */}
        <div className="flex items-center gap-2 p-2 rounded-md flex-1">
          <label className="text-sm font-medium whitespace-nowrap flex items-center" style={{ marginBottom: '0px' }}>
            Status:
          </label>
          <select
            className="form-select text-white-dark"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        {/* Filtro Ordem */}
        <div className="flex items-center gap-2 p-2 rounded-md flex-1">
          <label className="text-sm font-medium whitespace-nowrap flex items-center" style={{ marginBottom: '0px' }}>
            Ordem:
          </label>
          <select className="form-select text-white-dark">
            <option value="">Padrão</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
            <option value="recentes">Mais Recentes</option>
            <option value="antigos">Mais Antigos</option>
          </select>
        </div>

        {/* Botão para abrir os filtros avançados */}
        <button type="button" className="btn btn-primary flex items-center" onClick={toggleFilterModal}>
          <IconFilter className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          Filtrar ({activeFilters})
        </button>
      </div>

      {/* Modal Lateral para filtros avançados */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Área para fechar o modal ao clicar fora */}
          <div className="bg-gray-800 bg-opacity-50 flex-1" onClick={toggleFilterModal}></div>
          <div className="bg-white w-80 p-5 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Filtros Avançados</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">CNPJ</label>
                <TextInput
                  placeholder="Digite o CNPJ"
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
                <TextInput
                  placeholder="Digite o nome"
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Telefone</label>
                <TextInput
                  placeholder="Telefone"
                  className="w-full"
                />
              </div>
              <Button className="btn btn-primary" fullWidth variant="filled">
                Aplicar Filtros
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Seção da tabela ou do skeleton de carregamento */}
      <div className="panel datatables">
        {loading ? (
          // Skeleton que reflete a estrutura da tabela
          <div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex justify-between gap-4 mb-2">
                <Skeleton height={20} width="15%" radius="md" />
                <Skeleton height={20} width="15%" radius="md" />
                <Skeleton height={20} width="30%" radius="md" />
                <Skeleton height={20} width="15%" radius="md" />
                <Skeleton height={20} width="10%" radius="md" />
                <Skeleton height={20} width="15%" radius="md" />
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>

      {/* Modal lateral para criação de empresa */}
      <Drawer
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Empresa"
        padding="xl"
        position="right"
        size="md"
      >
        {/* Formulário para criação de empresa */}
        <form onSubmit={handleSubmitCreateEmpresa}>
          <div className="mb-4">
            <TextInput
              label="Nome da Empresa"
              placeholder="Digite o nome da empresa"
              value={empNome}
              onChange={(e) => setEmpNome(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <TextInput
              label="CPF"
              placeholder="Digite o CPF"
              value={empCPF}
              onChange={(e) => setEmpCPF(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <TextInput
              label="CNPJ"
              placeholder="Digite o CNPJ"
              value={empCNPJ}
              onChange={(e) => setEmpCNPJ(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <TextInput
              label="URL"
              placeholder="Digite a URL"
              value={empURL}
              onChange={(e) => setEmpURL(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Textarea
              label="Descrição"
              placeholder="Digite uma descrição"
              value={empDescricao}
              onChange={(e) => setEmpDescricao(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <TextInput
              label="ID Endereço"
              placeholder="Digite o ID do endereço"
              value={cidEnderecoID}
              onChange={(e) => setCidEnderecoID(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="filled">
              Criar Empresa
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default EmpresasList;

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
  Group,
  Stack,
  MultiSelect,
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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle(''));
  }, [dispatch]);

  /** Estados para paginação, busca, ordenação e filtros */
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState<Empresa[]>([]);
  const [recordsData, setRecordsData] = useState<Empresa[]>([]);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'name',
    direction: 'asc',
  });
  const [statusFilter, setStatusFilter] = useState<string | null>('');
  const [activeFilters, setActiveFilters] = useState(0);

  /** Estado de loading */
  const [loading, setLoading] = useState(true);

  // Modal de filtros avançados
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  // Modal de criação de empresa
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleCreateCompany = () => {
    setIsCreateModalOpen(true);
  };

  // Estados para os campos do modal de criação de empresa
  const [empNome, setEmpNome] = useState('');
  const [empSegmento, setEmpSegmento] = useState('');
  const [empURL, setEmpURL] = useState('');
  // Para o campo "Resumo": selecionar CPF ou CNPJ e inserir o número
  const [empIdType, setEmpIdType] = useState('');
  const [empIdValue, setEmpIdValue] = useState('');

  // Simula a requisição dos dados com delay de 2 segundos
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const sortedData = sortBy(rowData, 'name');
      setInitialRecords(sortedData);
      setRecordsData(sortedData);
      setLoading(false);
    }, 2000);
  }, []);

  // Aplica filtros de busca e status
  useEffect(() => {
    if (!loading) {
      const filteredData = rowData.filter((record) => {
        return (
          (statusFilter
            ? statusFilter === 'ativo'
              ? record.isActive
              : !record.isActive
            : true) &&
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

  // Simula a importação de empresas
  const handleImportClick = () => {
    console.log('Importar empresas...');
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
      empSegmento,
      empURL,
      empIdType,
      empIdValue,
    });
    // Após o envio, reseta os campos e fecha o modal
    setEmpNome('');
    setEmpSegmento('');
    setEmpURL('');
    setEmpIdType('');
    setEmpIdValue('');
    setIsCreateModalOpen(false);
  };

  // Estados para os filtros do modal de filtragem (atualizados conforme solicitado)
  const [filterEmpNome, setFilterEmpNome] = useState('');
  const [filterDataCriacao, setFilterDataCriacao] = useState('');
  const [filterDataUltimoContato, setFilterDataUltimoContato] = useState('');
  const [filterSegmento, setFilterSegmento] = useState('');
  const [filterQtdTotalNegociacoesFrom, setFilterQtdTotalNegociacoesFrom] = useState('');
  const [filterQtdTotalNegociacoesTo, setFilterQtdTotalNegociacoesTo] = useState('');
  const [filterQtdNegociacoesEmAndamentoFrom, setFilterQtdNegociacoesEmAndamentoFrom] = useState('');
  const [filterQtdNegociacoesEmAndamentoTo, setFilterQtdNegociacoesEmAndamentoTo] = useState('');
  const [filterQtdNegociacoesVendidasFrom, setFilterQtdNegociacoesVendidasFrom] = useState('');
  const [filterQtdNegociacoesVendidasTo, setFilterQtdNegociacoesVendidasTo] = useState('');
  const [filterQtdNegociacoesPerdidasFrom, setFilterQtdNegociacoesPerdidasFrom] = useState('');
  const [filterQtdNegociacoesPerdidasTo, setFilterQtdNegociacoesPerdidasTo] = useState('');
  const [filterQtdNegociacoesPausadasFrom, setFilterQtdNegociacoesPausadasFrom] = useState('');
  const [filterQtdNegociacoesPausadasTo, setFilterQtdNegociacoesPausadasTo] = useState('');

  // Trata o envio dos filtros do modal
  const handleApplyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Aplicar filtros:', {
      filterEmpNome,
      filterDataCriacao,
      filterDataUltimoContato,
      filterSegmento,
      filterQtdTotalNegociacoesFrom,
      filterQtdTotalNegociacoesTo,
      filterQtdNegociacoesEmAndamentoFrom,
      filterQtdNegociacoesEmAndamentoTo,
      filterQtdNegociacoesVendidasFrom,
      filterQtdNegociacoesVendidasTo,
      filterQtdNegociacoesPerdidasFrom,
      filterQtdNegociacoesPerdidasTo,
      filterQtdNegociacoesPausadasFrom,
      filterQtdNegociacoesPausadasTo,
    });
    // Aqui você aplicaria os filtros à tabela
    setIsFilterModalOpen(false);
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
          <label className="text-sm font-medium whitespace-nowrap">
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
          <label className="text-sm font-medium whitespace-nowrap">
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
          <label className="text-sm font-medium whitespace-nowrap">
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
          <label className="text-sm font-medium whitespace-nowrap">
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
        <Button type="button" variant="outline" onClick={toggleFilterModal}>
          <IconFilter className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          Filtrar ({activeFilters})
        </Button>
      </div>

      {/* Modal de filtragem (Drawer) com footer fixo */}
      <Drawer
        opened={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title={<h1 style={{ margin: 0 }}>Filtrar Empresas</h1>}
        padding="xl"
        size="md"
        position="right"
        overlayOpacity={0.55}
        overlayBlur={0}
        styles={{
          drawer: { maxWidth: '400px', width: '100%' },
          header: {
            backgroundColor: '#fff',
            padding: '1rem',
            borderBottom: '1px solid #ddd',
          },
          body: {
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 120px)',
            paddingBottom: '100px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #e0e0e0',
          },
        }}
      >
        <form id="filterForm" onSubmit={handleApplyFilters}>
          <Stack spacing="md">
            <TextInput
              label="Nome da Empresa"
              placeholder="Digite o nome da empresa"
              value={filterEmpNome}
              onChange={(e) => setFilterEmpNome(e.target.value)}
            />
            <TextInput
              label="Data de Criação"
              placeholder="Selecione a data"
              type="date"
              value={filterDataCriacao}
              onChange={(e) => setFilterDataCriacao(e.target.value)}
            />
            <TextInput
              label="Data do Último Contato"
              placeholder="Selecione a data"
              type="date"
              value={filterDataUltimoContato}
              onChange={(e) => setFilterDataUltimoContato(e.target.value)}
            />
            <Select
              label="Segmento"
              placeholder="Selecionar"
              data={[
                { value: 'tecnologia', label: 'Tecnologia' },
                { value: 'industria', label: 'Indústria' },
                { value: 'servicos', label: 'Serviços' },
                { value: 'outro', label: 'Outro' },
              ]}
              value={filterSegmento}
              onChange={(value) => setFilterSegmento(value || '')}
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Qtd Total de Negociações
              </label>
              <Group noWrap>
                <TextInput
                  placeholder="De"
                  type="number"
                  value={filterQtdTotalNegociacoesFrom}
                  onChange={(e) =>
                    setFilterQtdTotalNegociacoesFrom(e.target.value)
                  }
                />
                <TextInput
                  placeholder="Até"
                  type="number"
                  value={filterQtdTotalNegociacoesTo}
                  onChange={(e) =>
                    setFilterQtdTotalNegociacoesTo(e.target.value)
                  }
                />
              </Group>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Negociações em Andamento
              </label>
              <Group noWrap>
                <TextInput
                  placeholder="De"
                  type="number"
                  value={filterQtdNegociacoesEmAndamentoFrom}
                  onChange={(e) =>
                    setFilterQtdNegociacoesEmAndamentoFrom(e.target.value)
                  }
                />
                <TextInput
                  placeholder="Até"
                  type="number"
                  value={filterQtdNegociacoesEmAndamentoTo}
                  onChange={(e) =>
                    setFilterQtdNegociacoesEmAndamentoTo(e.target.value)
                  }
                />
              </Group>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Negociações Vendidas
              </label>
              <Group noWrap>
                <TextInput
                  placeholder="De"
                  type="number"
                  value={filterQtdNegociacoesVendidasFrom}
                  onChange={(e) =>
                    setFilterQtdNegociacoesVendidasFrom(e.target.value)
                  }
                />
                <TextInput
                  placeholder="Até"
                  type="number"
                  value={filterQtdNegociacoesVendidasTo}
                  onChange={(e) =>
                    setFilterQtdNegociacoesVendidasTo(e.target.value)
                  }
                />
              </Group>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Negociações Perdidas
              </label>
              <Group noWrap>
                <TextInput
                  placeholder="De"
                  type="number"
                  value={filterQtdNegociacoesPerdidasFrom}
                  onChange={(e) =>
                    setFilterQtdNegociacoesPerdidasFrom(e.target.value)
                  }
                />
                <TextInput
                  placeholder="Até"
                  type="number"
                  value={filterQtdNegociacoesPerdidasTo}
                  onChange={(e) =>
                    setFilterQtdNegociacoesPerdidasTo(e.target.value)
                  }
                />
              </Group>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Negociações Pausadas
              </label>
              <Group noWrap>
                <TextInput
                  placeholder="De"
                  type="number"
                  value={filterQtdNegociacoesPausadasFrom}
                  onChange={(e) =>
                    setFilterQtdNegociacoesPausadasFrom(e.target.value)
                  }
                />
                <TextInput
                  placeholder="Até"
                  type="number"
                  value={filterQtdNegociacoesPausadasTo}
                  onChange={(e) =>
                    setFilterQtdNegociacoesPausadasTo(e.target.value)
                  }
                />
              </Group>
            </div>
          </Stack>
        </form>
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
          <Button variant="outline" onClick={toggleFilterModal}>
            Cancelar
          </Button>
          <Button className="btn btn-primary" type="submit" form="filterForm">
            Aplicar Filtro
          </Button>
        </div>
      </Drawer>

      {/* Seção da tabela ou do skeleton de carregamento */}
      <div className="panel datatables">
        {loading ? (
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

      {/* Modal para criação de empresa (refeito como na página de contatos) */}
      <Drawer
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Empresa"
        padding="xl"
        position="right"
        size="lg"
        overlayOpacity={0.55}
        overlayBlur={0}
        styles={{
          drawer: { maxWidth: '600px', width: '100%' },
          header: {
            backgroundColor: '#fff',
            padding: '1rem',
            borderBottom: '1px solid #ddd',
          },
        }}
      >
        <form
          id="createCompanyForm"
          onSubmit={handleSubmitCreateEmpresa}
          style={{ position: 'relative', paddingBottom: '80px' }} // espaço para o footer fixo
        >
          <Stack spacing="md">
            <TextInput
              label="Nome da Empresa *"
              placeholder="Digite o nome da empresa"
              value={empNome}
              onChange={(e) => setEmpNome(e.target.value)}
              required
            />
            <Select
              label="Segmento"
              placeholder="Selecionar"
              data={[
                { value: 'tecnologia', label: 'Tecnologia' },
                { value: 'industria', label: 'Indústria' },
                { value: 'servicos', label: 'Serviços' },
                { value: 'outro', label: 'Outro' },
              ]}
              value={empSegmento}
              onChange={(value) => setEmpSegmento(value || '')}
            />
            <TextInput
              label="URL"
              placeholder="Digite o endereço do site da empresa"
              value={empURL}
              onChange={(e) => setEmpURL(e.target.value)}
            />
            <Group noWrap>
              <Select
                label="Identificação"
                placeholder="Selecionar"
                data={[
                  { value: 'CPF', label: 'CPF' },
                  { value: 'CNPJ', label: 'CNPJ' },
                ]}
                value={empIdType}
                onChange={(value) => setEmpIdType(value || '')}
                style={{ width: '30%' }}
                required
              />
              <TextInput
                label="Número"
                placeholder={empIdType === 'CPF' ? 'Digite o CPF' : 'Digite o CNPJ'}
                value={empIdValue}
                onChange={(e) => setEmpIdValue(e.target.value)}
                style={{ width: '70%' }}
                required
              />
            </Group>
          </Stack>
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="btn btn-primary" type="submit" form="createCompanyForm">
              Criar Empresa
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default EmpresasList;

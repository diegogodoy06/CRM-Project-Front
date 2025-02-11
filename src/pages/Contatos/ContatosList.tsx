import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Button, Input, Select, Skeleton } from '@mantine/core';
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

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords] = useState(sortBy(rowData, 'firstName'));
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'firstName',
    direction: 'asc',
  });
  const [selectedCompany, setSelectedCompany] = useState<string | null>('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters] = useState(0);

  // Estado de loading para simular o carregamento dos dados (ex: 2 segundos)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const companies = [
    { id: '1', name: 'Empresa A' },
    { id: '2', name: 'Empresa B' },
    { id: '3', name: 'Empresa C' },
  ];

  // Filtragem dos registros
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
    setRecordsData((prevData) => prevData.slice(from, to));
  }, [page, pageSize]);

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
    <div>
      {/* Botões de Importar e Criar Empresa */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" onClick={handleImportClick}>
            Importar
          </Button>
          <Button className="btn btn-primary" onClick={handleCreateContact}>
            Criar Empresa
          </Button>
        </div>
      </div>

      {/* Linha de filtros */}
      <div className="flex gap-4 items-center px-4 border mb-4">
        <div className="flex items-center gap-2 p-1 rounded-md flex-1">
          <label className="text-sm font-medium whitespace-nowrap flex items-center mb-0">
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
          <label className="text-sm font-medium whitespace-nowrap flex items-center mb-0">
            Responsável:
          </label>
          <select className="form-select text-white-dark">
            <option value="">Diego Alexandre</option>
            <option value="categoria1">Categoria 1</option>
            <option value="categoria2">Categoria 2</option>
            <option value="categoria3">Categoria 3</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-md flex-1">
          <label className="text-sm font-medium whitespace-nowrap flex items-center mb-0">
            Status:
          </label>
          <select className="form-select text-white-dark">
            <option value="">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-md flex-1">
          <label className="text-sm font-medium whitespace-nowrap flex items-center mb-0">
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

        <button
          type="button"
          className="btn btn-primary flex items-center"
          onClick={toggleFilterModal}
        >
          <IconFilter className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          Filtrar ({activeFilters})
        </button>
      </div>

      {/* Modal Lateral para Filtros */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="bg-gray-800 bg-opacity-50 flex-1"
            onClick={toggleFilterModal}
          ></div>
          <div className="bg-white w-80 p-5 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Filtrar Cards</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Dono</label>
                <Input type="text" className="w-full" placeholder="Nome do dono" />
              </div>
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
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome</label>
                <Input type="text" className="w-full" placeholder="Nome do card" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Data de Criação</label>
                <Input type="date" className="w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Empresa</label>
                <Input type="text" className="w-full" placeholder="Nome da empresa" />
              </div>
              <Button className="btn btn-primary" fullWidth variant="filled">
                Aplicar Filtros
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Tabela: Skeleton somente enquanto loading */}
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
    </div>
  );
};

export default Contatos;

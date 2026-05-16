import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import SummaryCards from '../components/dashboard/SummaryCards';
import ChartsSection from '../components/dashboard/ChartsSection';
import TransactionTable from '../components/dashboard/TransactionTable';
import Button from '../components/Button';
import { useTransactions } from '../hooks/useTransactions';

export default function DashboardPage() {
  const {
    transactions,
    allFiltered,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortKey,
    sortDir,
    toggleSort,
    stats,
    statusChartData,
    volumeOverTime,
    currencyChartData,
    reload,
  } = useTransactions();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-title">Section 3</p>
          <h1 className="page-title mt-2">Transaction Dashboard</h1>
          <p className="page-subtitle">
            Summary metrics, charts, and paginated transaction history
          </p>
        </div>
        <Button variant="secondary" onClick={reload} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <SummaryCards stats={stats} loading={loading} />
      <ChartsSection
        statusChartData={statusChartData}
        volumeOverTime={volumeOverTime}
        currencyChartData={currencyChartData}
        loading={loading}
      />
      <TransactionTable
        transactions={transactions}
        allFiltered={allFiltered}
        loading={loading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortKey={sortKey}
        sortDir={sortDir}
        toggleSort={toggleSort}
      />
    </motion.div>
  );
}

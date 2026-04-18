import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { useManagerPerformanceQuery } from '../hooks/useAdmin';
import { downloadCSV } from '../../../shared/utils/exportUtils';
import { Trophy, Award, Users, Download, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { ensureUtc } from '../../../shared/utils/date';

type ManagerPerf = {
  managerId: number;
  managerName: string;
  email: string;
  ordersProcessed: number;
  averageProcessingTimeMinutes: number;
  lastActiveAt: string | null;
};

export function ManagerPerformancePage() {
  const { t, locale } = useI18n();
  const { data: managers = [], isLoading } = useManagerPerformanceQuery();
  const dateTimeFormatter = new Intl.DateTimeFormat(
    locale === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US',
    { dateStyle: 'medium', timeStyle: 'short' }
  );

  const totalOrders = managers.reduce((sum: number, manager: ManagerPerf) => sum + manager.ordersProcessed, 0);
  const topManager = managers.length > 0 ? managers[0] : null;

  const handleExport = () => {
    const headers = [t.auth.manager, t.common.email, t.admin.ordersProcessed, t.admin.lastActive];
    const rows = managers.map((manager: ManagerPerf) => [
      manager.managerName,
      manager.email,
      String(manager.ordersProcessed),
      manager.lastActiveAt ? dateTimeFormatter.format(new Date(ensureUtc(manager.lastActiveAt))) : t.admin.never,
    ]);
    downloadCSV('manager_performance', headers, rows);
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (index === 1) return <Award className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-700" />;
    return <span className="flex h-5 w-5 items-center justify-center text-xs font-bold text-neutral-400">#{index + 1}</span>;
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PageHeader
          title={t.admin.managerPerformance}
          description={t.admin.managerPerformanceDesc}
        />
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> {t.admin.exportCsv}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-medium">{t.admin.totalManagers}</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{managers.length}</p>
            </div>
            <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-medium">{t.admin.totalOrdersProcessed}</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{totalOrders}</p>
            </div>
            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-medium">{t.admin.topPerformer}</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1 truncate">{topManager?.managerName || '-'}</p>
            </div>
            <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 font-medium w-12">{t.admin.rank}</th>
                <th className="px-6 py-4 font-medium">{t.auth.manager}</th>
                <th className="px-6 py-4 font-medium">{t.common.email}</th>
                <th className="px-6 py-4 font-medium text-center">{t.admin.ordersProcessed}</th>
                <th className="px-6 py-4 font-medium">{t.admin.lastActive}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {managers.map((manager: ManagerPerf, index: number) => (
                <tr
                  key={manager.managerId}
                  className={clsx(
                    'transition-colors hover:bg-neutral-50/50',
                    index === 0 && 'bg-amber-50/30'
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{getRankBadge(index)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                        {manager.managerName[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-neutral-900">{manager.managerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{manager.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                      {manager.ordersProcessed}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-xs">
                    {manager.lastActiveAt
                      ? dateTimeFormatter.format(new Date(ensureUtc(manager.lastActiveAt)))
                      : <span className="text-neutral-400 italic">{t.admin.never}</span>}
                  </td>
                </tr>
              ))}
              {managers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    {t.admin.noManagers}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

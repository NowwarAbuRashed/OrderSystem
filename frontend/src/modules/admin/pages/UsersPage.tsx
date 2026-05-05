import { useState } from 'react';
import { useAuth } from '../../../app/store/auth-context';
import { useAdminUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from '../hooks/useAdmin';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { StatCard } from '../../../shared/components/StatCard';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { Card } from '../../../shared/components/Card';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import { formatDate } from '../../../shared/utils/date';

type AdminUser = {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  orderCount: number;
};

export function AdminUsersPage() {
  const { t, locale } = useI18n();
  const { user: currentUser } = useAuth();
  const [roleFilter, setRoleFilter] = useState<string>('');
  const dateLocale = locale === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US';
  const params = {
    page: 1,
    pageSize: 50,
    ...(roleFilter ? { role: roleFilter } : {}),
  };
  const { data, isLoading, error } = useAdminUsersQuery(params);
  const updateRole = useUpdateUserRoleMutation();
  const updateStatus = useUpdateUserStatusMutation();

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message="Could not load users." />;

  const users: AdminUser[] = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  const handleRoleChange = (userId: number, newRole: string) => {
    updateRole.mutate({ userId, role: newRole });
  };

  const handleStatusToggle = (userId: number, currentlyActive: boolean) => {
    updateStatus.mutate({ userId, isActive: !currentlyActive });
  };

  const columns: Column<AdminUser>[] = [
    {
      header: t.admin.userName,
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.fullName}</div>
          <div className="text-xs text-slate-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: t.admin.role,
      accessor: (row) => {
        if (row.role === 'CUSTOMER') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold">
              {t.auth.customer}
            </span>
          );
        }

        const isSuperAdmin = currentUser?.userId === 1;

        if (row.role === 'ADMIN') {
          if (isSuperAdmin && row.userId !== currentUser?.userId) {
            return (
              <select
                value={row.role}
                onChange={(e) => handleRoleChange(row.userId, e.target.value)}
                className="text-xs font-medium px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={updateRole.isPending}
              >
                <option value="ADMIN">{t.auth.admin}</option>
                <option value="MANAGER">{t.auth.manager}</option>
              </select>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
              <Shield className="w-3 h-3" />
              {t.auth.admin}
            </span>
          );
        }

        if (row.role === 'MANAGER') {
          if (isSuperAdmin) {
            return (
              <select
                value={row.role}
                onChange={(e) => handleRoleChange(row.userId, e.target.value)}
                className="text-xs font-medium px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={updateRole.isPending}
              >
                <option value="MANAGER">{t.auth.manager}</option>
                <option value="ADMIN">{t.auth.admin}</option>
              </select>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
              {t.auth.manager}
            </span>
          );
        }

        return <span>{row.role}</span>;
      },
    },
    {
      header: t.admin.statusLabel,
      accessor: (row) => (
        <StatusBadge
          label={row.isActive ? t.admin.active : t.admin.inactive}
          variant={row.isActive ? 'success' : 'error'}
        />
      ),
    },
    {
      header: t.admin.orderCountLabel,
      accessor: (row) => (
        <span className="font-semibold text-slate-700">{row.orderCount}</span>
      ),
    },
    {
      header: t.admin.joinedDate,
      accessor: (row) => (
        <span className="text-sm text-slate-500">
          {formatDate(row.createdAt, undefined, dateLocale)}
        </span>
      ),
    },
    {
      header: t.admin.actionsLabel,
      accessor: (row) => {
        if (row.role === 'ADMIN') {
          return <span className="text-xs text-slate-400">—</span>;
        }
        return (
          <button
            onClick={() => handleStatusToggle(row.userId, row.isActive)}
            disabled={updateStatus.isPending}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
              row.isActive
                ? 'bg-danger-50 text-danger-600 hover:bg-danger-100'
                : 'bg-success-50 text-success-600 hover:bg-success-100'
            }`}
          >
            {row.isActive ? t.admin.deactivate : t.admin.activate}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={t.admin.userManagement} description={t.admin.userManagementDesc} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label={t.admin.totalUsers} value={totalCount} variant="default" />
        <StatCard icon={<UserCheck className="w-5 h-5" />} label={t.admin.activeUsers} value={activeCount} variant="success" />
        <StatCard icon={<UserX className="w-5 h-5" />} label={t.admin.inactiveUsers} value={inactiveCount} variant="danger" />
        <StatCard icon={<Shield className="w-5 h-5" />} label={t.admin.admins} value={adminCount} variant="info" />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-600">{t.admin.filterByRole}:</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t.common.all}</option>
          <option value="1">{t.auth.customer}</option>
          <option value="2">{t.auth.manager}</option>
          <option value="3">{t.auth.admin}</option>
        </select>
      </div>

      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <AppTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          keyField="userId"
          emptyMessage={t.admin.noUsers}
        />
      </Card>
    </div>
  );
}

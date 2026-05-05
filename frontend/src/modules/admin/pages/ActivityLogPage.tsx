import { useState, Fragment } from 'react';
import { useAdminActivityQuery } from '../hooks/useAdmin';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { Activity, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { ensureUtc } from '../../../shared/utils/date';

const parseDetailsData = (rawDetails: string) => {
  if (!rawDetails) return null;

  try {
    const parsed = JSON.parse(rawDetails);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
};

function PriceChangesTable({ rawDetails, t }: { rawDetails: string, t: any }) {
  const details = parseDetailsData(rawDetails);
  const changes = (details?.PriceChanges as Array<any>) || [];
  
  if (!details || changes.length === 0) {
    return <div className="text-sm text-slate-500 italic py-2">{t.admin?.noPriceInfo || 'No detailed price information available for this event.'}</div>;
  }
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden my-2 max-w-2xl">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
          <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider text-left border-b border-slate-200">
            <th className="px-4 py-2 font-medium">{t.admin?.productName || 'Product Name'}</th>
            <th className="px-4 py-2 font-medium text-right">{t.admin?.oldPrice || 'Old Price'}</th>
            <th className="px-4 py-2 font-medium text-right">{t.admin?.newPrice || 'New Price'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {changes.map((c) => (
             <tr key={c.ProductId} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2">{c.ProductName} <span className="text-xs text-slate-400 ml-1">#{c.ProductId}</span></td>
                <td className="px-4 py-2 text-right text-slate-500 line-through">${Number(c.OldPrice).toFixed(2)}</td>
                <td className="px-4 py-2 text-right font-medium text-green-600">${Number(c.NewPrice).toFixed(2)}</td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GeneralChangesTable({ rawDetails, t }: { rawDetails: string, t: any }) {
  const details = parseDetailsData(rawDetails);
  const changes = (details?.changes as Array<{Field: string, OldValue: any, NewValue: any}>) || [];
  
  if (!details || changes.length === 0) {
    return <div className="text-sm text-slate-500 italic py-2">{t.admin?.noChangeInfo || 'No detailed change information available for this event.'}</div>;
  }
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden my-2 max-w-2xl">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
          <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider text-left border-b border-slate-200">
            <th className="px-4 py-2 font-medium">{t.admin?.field || 'Field'}</th>
            <th className="px-4 py-2 font-medium">{t.admin?.oldValue || 'Old Value'}</th>
            <th className="px-4 py-2 font-medium">{t.admin?.newValue || 'New Value'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {changes.map((c, idx) => (
             <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2 font-medium text-slate-700">{c.Field}</td>
                <td className="px-4 py-2 text-slate-500 line-through">{String(c.OldValue)}</td>
                <td className="px-4 py-2 font-medium text-green-600">{String(c.NewValue)}</td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ActivityLogEntry = {
  id: number;
  actionType: string;
  entityType: string;
  entityId: string;
  performedByUserId: number | null;
  performedByUser?: {
    fullName?: string | null;
  } | null;
  timestamp: string;
  details: string;
};

export function AdminActivityLogPage() {
  const { t, locale } = useI18n();
  const [entityFilter, setEntityFilter] = useState('');
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());
  const dateTimeFormatter = new Intl.DateTimeFormat(
    locale === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US',
    { dateStyle: 'medium', timeStyle: 'short' }
  );
  const statusLabelMap: Record<string, string> = {
    PROCESSING: t.orders.processing,
    READY: t.orders.ready,
    OUT_FOR_DELIVERY: t.orders.outForDelivery,
    DELIVERED: t.orders.delivered,
    ACTIVE: t.manager.active,
    INACTIVE: t.manager.inactive,
  };

  const { data: logs, isLoading, isError } = useAdminActivityQuery({
    count: 100,
    entityType: entityFilter || undefined
  });

  const toggleExpand = (id: number) => {
    const next = new Set(expandedLogs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedLogs(next);
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'ORDER_STATUS_CHANGE':
        return t.admin.statusChangedAction;
      case 'PRODUCT_BULK_STATUS':
        return t.admin.bulkStatusAction;
      case 'PRODUCT_BULK_PRICE':
        return t.admin.bulkPriceAction;
      case 'PRODUCT_EDIT':
        return t.admin.productUpdatedAction;
      case 'USER_ROLE_CHANGE':
        return t.admin.userRoleChanged || 'User Role Changed';
      case 'USER_STATUS_CHANGE':
        return t.admin.userStatusChanged || 'User Status Changed';
      default:
        return actionType.replaceAll('_', ' ');
    }
  };

  const getEntityLabel = (log: ActivityLogEntry) => {
    if (log.entityType === 'Order') {
      return `${t.orders.orderId} #${log.entityId}`;
    }

    if (log.entityType === 'Product' && log.entityId === 'Multiple') {
      return t.admin.productsLabel;
    }

    if (log.entityType === 'Product') {
      return `${t.admin.productName} #${log.entityId}`;
    }

    if (log.entityType === 'User') {
      return `${t.admin.userLabel} #${log.entityId}`;
    }

    if (log.entityId === 'Multiple') {
      return `${log.entityType} ${t.admin.multiple}`;
    }

    return `${log.entityType} #${log.entityId}`;
  };

  const getDetailsLabel = (log: ActivityLogEntry) => {
    const details = parseDetailsData(log.details);

    if (!details) {
      return log.details || t.admin.noDetails;
    }

    if (log.actionType === 'ORDER_STATUS_CHANGE') {
      const oldStatus = typeof details.OldStatus === 'string' ? details.OldStatus : null;
      const newStatus = typeof details.NewStatus === 'string' ? details.NewStatus : null;

      if (oldStatus && newStatus) {
        return `${statusLabelMap[oldStatus] || oldStatus} -> ${statusLabelMap[newStatus] || newStatus}`;
      }
    }

    if (log.actionType === 'PRODUCT_BULK_STATUS') {
      const count = typeof details.Count === 'number' ? details.Count : null;
      const isActive = typeof details.IsActive === 'boolean' ? details.IsActive : null;

      if (count !== null && isActive !== null) {
        const productLabel = count === 1 ? t.admin.productName : t.admin.productsLabel;
        const statusLabel = isActive ? t.manager.active : t.manager.inactive;
        return `${count} ${productLabel} ${t.admin.setTo} ${statusLabel}`;
      }
    }

    if (log.actionType === 'PRODUCT_BULK_PRICE') {
      const count = typeof details.Count === 'number' ? details.Count : null;
      const percentage = typeof details.Percentage === 'number' ? details.Percentage : null;

      if (count !== null && percentage !== null) {
        const productLabel = count === 1 ? t.admin.productName : t.admin.productsLabel;
        return `${count} ${productLabel} ${t.admin.priceAdjustedBy} ${percentage}%`;
      }
    }

    if (log.actionType === 'PRODUCT_EDIT' && typeof details.message === 'string') {
      return details.message;
    }

    if (log.actionType === 'USER_ROLE_CHANGE') {
      const oldRole = typeof details.OldRole === 'string' ? details.OldRole : null;
      const newRole = typeof details.NewRole === 'string' ? details.NewRole : null;

      if (oldRole && newRole) {
        return `${t.admin.roleChangedFrom || 'Role changed from'} ${oldRole} ${t.admin.to || 'to'} ${newRole}`;
      }
    }

    if (log.actionType === 'USER_STATUS_CHANGE') {
      const oldStatus = typeof details.OldStatus === 'boolean' ? details.OldStatus : null;
      const newStatus = typeof details.NewStatus === 'boolean' ? details.NewStatus : null;

      if (oldStatus !== null && newStatus !== null) {
        return `${t.admin.statusChangedFrom || 'Status changed from'} ${oldStatus ? t.manager.active : t.manager.inactive} ${t.admin.to || 'to'} ${newStatus ? t.manager.active : t.manager.inactive}`;
      }
    }

    return log.details;
  };

  if (isError) return (
    <div className="flex-1 bg-slate-50 flex flex-col p-4 md:p-8">
      <PageHeader 
        title={t.admin?.activityLog || 'Activity Log'} 
        description={t.admin?.activityLogDesc || 'Audit trail of important system actions'} 
      />
      <div className="text-center py-10 text-red-500">{t.admin?.failedToLoadLogs || 'Failed to load activity logs.'}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t.admin?.activityLog || 'System Activity Log'} 
        description={t.admin?.activityLogDesc || 'Audit trail of important system actions'} 
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-3 text-sm text-neutral-600">
          <Activity className="w-5 h-5 text-neutral-400" />
          <span>{t.admin.monitoring} <strong>{logs?.length || 0}</strong> {t.admin.recentActions}</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm border-neutral-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="">{t.admin.allEntities}</option>
              <option value="Order">{t.admin.ordersLabel}</option>
              <option value="Product">{t.admin.productsLabel}</option>
              <option value="User">{t.admin.usersLabel}</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingBlock />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4 font-medium">{t.admin.timestamp}</th>
                  <th className="px-6 py-4 font-medium">{t.admin.action}</th>
                  <th className="px-6 py-4 font-medium">{t.admin.entity}</th>
                  <th className="px-6 py-4 font-medium">{t.admin.userLabel}</th>
                  <th className="px-6 py-4 font-medium max-w-xs">{t.admin.detailsLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs?.map((log: ActivityLogEntry) => {
                  const detailsLabel = getDetailsLabel(log);
                  const isExpanded = expandedLogs.has(log.id);
                  const canExpand = log.actionType === 'PRODUCT_BULK_PRICE' || log.actionType === 'PRODUCT_EDIT';

                  return (
                  <Fragment key={log.id}>
                    <tr className={`hover:bg-neutral-50/50 transition-colors ${isExpanded ? 'bg-neutral-50/50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                        {dateTimeFormatter.format(new Date(ensureUtc(log.timestamp)))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
                          {getActionLabel(log.actionType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-900">
                        {getEntityLabel(log)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.performedByUserId ? (
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-600 mr-2 uppercase">
                              {log.performedByUser?.fullName?.charAt(0) || 'U'}
                            </div>
                            <span className="text-neutral-600">
                              {log.performedByUser?.fullName || `ID: ${log.performedByUserId}`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">{t.admin.system}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <div className="max-w-sm truncate" title={typeof detailsLabel === 'string' ? detailsLabel : ''}>
                            {detailsLabel}
                          </div>
                          {canExpand && (
                            <button
                              onClick={() => toggleExpand(log.id)}
                              className="text-primary-600 hover:text-primary-700 hover:underline text-xs font-medium flex items-center gap-1 shrink-0"
                            >
                              {isExpanded ? (
                                <>{t.admin?.hideDetails || 'Hide Details'} <ChevronUp className="w-3 h-3" /></>
                              ) : (
                                <>{t.admin?.viewDetails || 'View Details'} <ChevronDown className="w-3 h-3" /></>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/30 border-b border-slate-100">
                        <td colSpan={5} className="px-6 py-3">
                           {log.actionType === 'PRODUCT_BULK_PRICE' ? (
                            <PriceChangesTable rawDetails={log.details} t={t} />
                          ) : (
                            <GeneralChangesTable rawDetails={log.details} t={t} />
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )})}
                {(!logs || logs.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      {t.admin.noActivityLogs}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

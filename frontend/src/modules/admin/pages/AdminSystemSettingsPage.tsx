import { useState, useEffect } from 'react';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { useSystemSettingsQuery, useUpdateSystemSettingsMutation } from '../hooks/useAdmin';
import { Save, Building2, Package, Truck } from 'lucide-react';

export function AdminSystemSettingsPage() {
  const { t } = useI18n();
  const { data: settings, isLoading } = useSystemSettingsQuery();
  const updateMutation = useUpdateSystemSettingsMutation();

  const [form, setForm] = useState<Record<string, string>>({
    'business.name': '',
    'business.email': '',
    'business.phone': '',
    'business.address': '',
    'stock.defaultMinThreshold': '10',
    'stock.criticalThreshold': '3',
    'delivery.zones': '',
    'delivery.defaultFee': '5.00',
    'delivery.freeAbove': '50.00',
  });

  useEffect(() => {
    if (settings) {
      setForm(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: () => alert(t.admin?.settingsSaved || 'Settings saved successfully!'),
      onError: () => alert(t.admin?.settingsFailed || 'Failed to save settings'),
    });
  };

  if (isLoading) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.admin?.systemSettings || 'System Settings'}
        description={t.admin?.systemSettingsDesc || 'Configure application-wide settings'}
      />

      {/* Business Information */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">{t.admin?.businessInformation || 'Business Information'}</h3>
            <p className="text-xs text-neutral-500">{t.admin?.businessDetailsDesc || 'General business details'}</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.admin?.businessName || 'Business Name'}</label>
            <input
              type="text"
              value={form['business.name']}
              onChange={e => handleChange('business.name', e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              placeholder="Marto Store"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.admin?.contactEmail || 'Contact Email'}</label>
            <input
              type="email"
              value={form['business.email']}
              onChange={e => handleChange('business.email', e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              placeholder="contact@marto.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.admin?.phoneNumber || 'Phone Number'}</label>
            <input
              type="tel"
              value={form['business.phone']}
              onChange={e => handleChange('business.phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              placeholder="+962 7XXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.admin?.businessAddress || 'Business Address'}</label>
            <input
              type="text"
              value={form['business.address']}
              onChange={e => handleChange('business.address', e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              placeholder="Amman, Jordan"
            />
          </div>
        </div>
      </div>

      {/* Stock Thresholds */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">{t.admin?.stockThresholds || 'Stock Thresholds'}</h3>
            <p className="text-xs text-neutral-500">{t.admin?.stockAlertLevelsDesc || 'Default inventory alert levels'}</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.admin?.defaultMinStock || 'Default Minimum Stock'}</label>
            <input
              type="number"
              value={form['stock.defaultMinThreshold']}
              onChange={e => handleChange('stock.defaultMinThreshold', e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              min="0"
            />
            <p className="mt-1 text-xs text-neutral-400">{t.admin?.defaultMinStockDesc || 'Products below this quantity trigger a low-stock alert'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.admin?.criticalStockLevel || 'Critical Stock Level'}</label>
            <input
              type="number"
              value={form['stock.criticalThreshold']}
              onChange={e => handleChange('stock.criticalThreshold', e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              min="0"
            />
            <p className="mt-1 text-xs text-neutral-400">{t.admin?.criticalStockLevelDesc || 'Products below this level are marked as critical'}</p>
          </div>
        </div>
      </div>

      {/* Delivery Zones */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">{t.admin?.deliverySettings || 'Delivery Settings'}</h3>
            <p className="text-xs text-neutral-500">{t.admin?.deliveryZonesDesc || 'Delivery zones and fee configuration'}</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.admin?.defaultDeliveryFee || 'Default Delivery Fee ($)'}</label>
            <input
              type="number"
              step="0.01"
              value={form['delivery.defaultFee']}
              onChange={e => handleChange('delivery.defaultFee', e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.admin?.freeDeliveryAbove || 'Free Delivery Above ($)'}</label>
            <input
              type="number"
              step="0.01"
              value={form['delivery.freeAbove']}
              onChange={e => handleChange('delivery.freeAbove', e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.admin?.deliveryZones || 'Delivery Zones'}</label>
            <textarea
              value={form['delivery.zones']}
              onChange={e => handleChange('delivery.zones', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors resize-none"
              placeholder="Zone A - Downtown&#10;Zone B - Suburbs&#10;Zone C - Rural"
            />
            <p className="mt-1 text-xs text-neutral-400">{t.admin?.deliveryZonesHint || 'Enter one zone per line'}</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {updateMutation.isPending ? (t.admin?.saving || 'Saving...') : (t.admin?.saveSettings || 'Save Settings')}
        </button>
      </div>
    </div>
  );
}

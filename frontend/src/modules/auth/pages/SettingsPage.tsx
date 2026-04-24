import { useState, useEffect, useMemo } from 'react';
import { useProfile, useUpdateProfile, useChangePassword } from '../../auth/hooks/useProfile';
import { useI18n } from '../../../app/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { getApiErrorMessage, getApiErrorMap } from '../../../shared/utils/error';
import { useAuth } from '../../../app/store/auth-context';

export function SettingsPage() {
  const { updateUser } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const { t } = useI18n();

  // Profile form state
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form state
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const profileSchema = useMemo(() => z.object({
    fullName: z.string()
      .min(2, t.validation?.minLength?.replace('{{min}}', '2') as string)
      .trim(),
  }), [t]);

  const passwordSchema = useMemo(() => z.object({
    currentPassword: z.string().min(1, t.validation?.required as string),
    newPassword: z.string()
      .min(8, t.validation?.passwordStrength as string)
      .regex(/[a-z]/, t.validation?.passwordStrength as string)
      .regex(/[A-Z]/, t.validation?.passwordStrength as string)
      .regex(/[0-9]/, t.validation?.passwordStrength as string)
      .regex(/[^a-zA-Z0-9]/, t.validation?.passwordStrength as string),
    confirmNewPassword: z.string()
  }).superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t.validation?.passwordNoMatch as string,
        path: ['confirmNewPassword']
      });
    }
  }), [t]);

  type ProfileForm = z.infer<typeof profileSchema>;
  type PasswordForm = z.infer<typeof passwordSchema>;

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: '' }
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' }
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({ fullName: profile.fullName });
    }
  }, [profile, profileForm]);

  const handleUpdateProfile = (data: ProfileForm) => {
    setProfileSuccess('');
    setProfileError('');

    updateProfile.mutate({ fullName: data.fullName }, {
      onSuccess: (res) => {
        setProfileSuccess(t.settings.profileUpdated);
        updateUser({ fullName: res.fullName });
      },
      onError: (err) => {
        const errorMsg = getApiErrorMessage(err);
        setProfileError(errorMsg);

        const map = getApiErrorMap(err);
        for (const [key, msg] of Object.entries(map)) {
          profileForm.setError(key as Path<ProfileForm>, { type: 'server', message: msg });
        }
      }
    });
  };

  const handleChangePassword = (data: PasswordForm) => {
    setPasswordSuccess('');
    setPasswordError('');

    changePassword.mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword }, {
      onSuccess: () => {
        setPasswordSuccess(t.settings.passwordChanged);
        passwordForm.reset();
      },
      onError: (err) => {
        const errorMsg = getApiErrorMessage(err);
        setPasswordError(errorMsg);

        const map = getApiErrorMap(err);
        for (const [key, msg] of Object.entries(map)) {
          passwordForm.setError(key as Path<PasswordForm>, { type: 'server', message: msg });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.settings.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{t.settings.subtitle}</p>
      </div>

      {/* Profile Info Card */}
      <Card className="shadow-sm border-slate-200/60 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{t.settings.profileInfo}</CardTitle>
              <CardDescription>{t.settings.profileDesc}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-5" noValidate>
            {profileSuccess && (
              <div className="bg-success-50 text-success-700 p-4 rounded-xl flex items-start gap-3 border border-success-100">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{profileSuccess}</p>
              </div>
            )}
            {profileError && (
              <div className="bg-danger-50 text-danger-700 p-4 rounded-xl flex items-start gap-3 border border-danger-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{profileError}</p>
              </div>
            )}

            <Input
              label={t.auth.fullName}
              type="text"
              {...profileForm.register('fullName')}
              error={profileForm.formState.errors.fullName?.message}
              placeholder={t.auth.fullNamePlaceholder}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.settings.email}</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500">
                <span>{profile?.email}</span>
                <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{t.settings.readOnly}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.settings.role}</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>{profile?.role}</span>
                <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{t.settings.readOnly}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={updateProfile.isPending}
                disabled={updateProfile.isPending}
                className="rounded-xl"
              >
                {t.actions.save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="shadow-sm border-slate-200/60 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-50 rounded-lg">
              <Lock className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{t.settings.changePassword}</CardTitle>
              <CardDescription>{t.settings.changePasswordDesc}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-5" noValidate>
            {passwordSuccess && (
              <div className="bg-success-50 text-success-700 p-4 rounded-xl flex items-start gap-3 border border-success-100">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{passwordSuccess}</p>
              </div>
            )}
            {passwordError && (
              <div className="bg-danger-50 text-danger-700 p-4 rounded-xl flex items-start gap-3 border border-danger-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{passwordError}</p>
              </div>
            )}

            <Input
              label={t.settings.currentPassword}
              type="password"
              {...passwordForm.register('currentPassword')}
              error={passwordForm.formState.errors.currentPassword?.message}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <Input
              label={t.settings.newPassword}
              type="password"
              {...passwordForm.register('newPassword')}
              error={passwordForm.formState.errors.newPassword?.message}
              placeholder={t.settings.newPasswordPlaceholder}
              autoComplete="new-password"
            />

            <Input
              label={t.settings.confirmNewPassword}
              type="password"
              {...passwordForm.register('confirmNewPassword')}
              error={passwordForm.formState.errors.confirmNewPassword?.message}
              placeholder={t.settings.confirmPasswordPlaceholder}
              autoComplete="new-password"
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={changePassword.isPending}
                disabled={changePassword.isPending}
                className="rounded-xl"
              >
                {t.actions.updatePassword}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

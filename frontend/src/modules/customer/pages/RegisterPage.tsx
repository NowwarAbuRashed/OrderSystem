import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '../../auth/hooks/useRegister';
import { useI18n } from '../../../app/i18n/i18n-context';
import { Card, CardContent } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { getApiErrorMessage, getApiErrorMap } from '../../../shared/utils/error';

export function RegisterPage() {
  const { t } = useI18n();
  const { mutate: registerUser, isPending, error: apiError } = useRegister();

  const registerSchema = useMemo(() => z.object({
    fullName: z.string()
      .min(2, t.validation?.minLength?.replace('{{min}}', '2') || 'Full name is required')
      .trim(),
    email: z.string()
      .min(1, t.validation?.required || 'Email is required')
      .email(t.validation?.invalidEmail || 'Invalid email address')
      .trim()
      .toLowerCase(),
    password: z.string()
      .min(8, t.validation?.passwordStrength || 'Password must be exactly 8 chars')
      .regex(/[a-z]/, t.validation?.passwordStrength || 'Requires lowercase')
      .regex(/[A-Z]/, t.validation?.passwordStrength || 'Requires uppercase')
      .regex(/[0-9]/, t.validation?.passwordStrength || 'Requires number')
      .regex(/[^a-zA-Z0-9]/, t.validation?.passwordStrength || 'Requires special character'),
    confirmPassword: z.string()
  }).superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t.validation?.passwordNoMatch || 'Passwords do not match',
        path: ['confirmPassword']
      });
    }
  }), [t]);

  type RegisterForm = z.infer<typeof registerSchema>;

  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' }
  });

  const onSubmit = (data: RegisterForm) => {
    registerUser(
      { fullName: data.fullName, email: data.email, password: data.password },
      {
        onError: (err) => {
          const map = getApiErrorMap(err);
          for (const [key, msg] of Object.entries(map)) {
            // @ts-ignore
            setError(key as any, { type: 'server', message: msg });
          }
        }
      }
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Brand Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/20 mb-4">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {t.auth.signUp}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            {t.auth.alreadyHaveAccount}{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
              {t.auth.signInLink}
            </Link>
          </p>
        </div>

        <Card className="shadow-xl border-slate-200/60 rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              {apiError && (
                <div className="bg-danger-50 text-danger-700 p-4 rounded-xl flex items-start gap-3 border border-danger-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{getApiErrorMessage(apiError)}</p>
                </div>
              )}

              <Input
                label={t.auth.fullName}
                type="text"
                {...register('fullName')}
                error={errors.fullName?.message}
                placeholder={t.auth.fullNamePlaceholder}
                autoComplete="off"
              />

              <Input
                label={t.auth.email}
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder={t.auth.emailPlaceholder}
                autoComplete="off"
              />

              <Input
                label={t.auth.password}
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder={t.settings.newPasswordPlaceholder}
                autoComplete="new-password"
              />

              <Input
                label={t.auth.confirmPassword}
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder={t.settings.confirmPasswordPlaceholder}
                autoComplete="new-password"
              />

              <div className="pt-1">
                <Button
                  type="submit"
                  className="w-full py-3 text-base rounded-xl"
                  disabled={isPending}
                  isLoading={isPending}
                >
                  {t.auth.signUp}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust bar */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.auth.secureRegistration}</span>
        </div>
      </div>
    </div>
  );
}

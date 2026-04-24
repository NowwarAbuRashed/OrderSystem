import { z } from 'zod';
import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { useI18n } from '../../../app/i18n/i18n-context';
import { getApiErrorMessage, getApiErrorMap } from '../../../shared/utils/error';
import { ErrorState } from '../../../shared/components/ErrorState';
import { Card, CardContent } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';

export function LoginPage() {
  const { mutate, isPending, error } = useLogin();
  const { t } = useI18n();

  const loginSchema = useMemo(() => z.object({
    email: z.string().email(t.validation?.invalidEmail as string),
    password: z.string().min(1, t.validation?.required as string),
  }), [t]);

  type LoginForm = z.infer<typeof loginSchema>;

  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = (data: LoginForm) => {
    mutate(data, {
      onError: (err) => {
        const map = getApiErrorMap(err);
        for (const [key, msg] of Object.entries(map)) {
          setError(key as Path<LoginForm>, { type: 'server', message: msg });
        }
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/20 mb-4">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {t.brandFull}
          </h1>
          <p className="text-sm text-primary-600 font-medium mt-1.5">
            {t.tagline}
          </p>
        </div>

        <Card className="shadow-xl border-slate-200/60 rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {t.auth.welcomeBack}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {t.auth.signInTitle}
              </p>
            </div>

            {error && <div className="mb-6"><ErrorState message={getApiErrorMessage(error)} /></div>}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                placeholder={t.auth.passwordPlaceholder}
                autoComplete="off"
              />

              <div className="pt-1">
                <Button
                  type="submit"
                  isLoading={isPending}
                  className="w-full py-3 text-base rounded-xl"
                >
                  {t.auth.signIn}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                {t.auth.orCreateAccount}{' '}
                <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  {t.auth.createAccount}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust bar */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.auth.secureLogin}</span>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 text-center text-sm text-slate-500 bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200/60 shadow-sm">
          <p className="font-semibold text-slate-700 mb-2">{t.auth.demoAccounts}</p>
          <div className="space-y-1 text-xs text-slate-500">
            <p>{t.auth.customer}: customer@local.com / Customer123!</p>
            <p>{t.auth.manager}: manager@local.com / Manager123!</p>
            <p>{t.auth.admin}: admin@local.com / Admin123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

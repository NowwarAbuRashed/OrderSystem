import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { ErrorState } from '../../../shared/components/ErrorState';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { mutate, isPending, error } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = (data: LoginForm) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-slate-200/60">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </CardTitle>
            <CardDescription className="mt-2">
              Please sign in to your account
            </CardDescription>
            <p className="mt-2 text-center text-sm text-slate-600">
              Or{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                create a new Customer account
              </Link>
            </p>
          </CardHeader>
          <CardContent className="mt-4">
            {error && <div className="mb-6"><ErrorState message={getApiErrorMessage(error)} /></div>}
            
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="Ex: admin@local.com"
              />

              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="••••••••"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={isPending}
                  className="w-full"
                >
                  Sign in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-500 space-y-1.5 bg-slate-200/50 p-4 rounded-xl border border-slate-200/60 shadow-sm">
          <p className="font-semibold text-slate-700">Demo Accounts</p>
          <p className="text-slate-600">Customer: customer@local.com / Customer123!</p>
          <p className="text-slate-600">Manager: manager@local.com / Manager123!</p>
          <p className="text-slate-600">Admin: admin@local.com / Admin123!</p>
        </div>
      </div>
    </div>
  );
}

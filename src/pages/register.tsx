import Image from 'next/image';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';

import { Input } from '@components/Form/Input';
import { successToast } from '@components/Toast/SuccessToast';
import { errorToast } from '@components/Toast/ErrorToast';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { api } from '@lib/api';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

const registerFormSchema = z
  .object({
    fullName: z
      .string({
        required_error: 'nome completo é obrigatório',
      })
      .min(6, {
        message: 'nome completo deve ter no mínimo 6 caracteres',
      }),
    email: z
      .string({
        required_error: 'e-mail é obrigatório',
      })
      .email('e-mail inválido'),
    password: z
      .string({
        required_error: 'senha é obrigatório',
      })
      .min(6, {
        message: 'senha deve ter no mínimo 6 caracteres',
      }),
    passwordConfirmation: z
      .string({
        required_error: 'confirmação de senha é obrigatório',
      })
      .min(6, {
        message: 'confirmação de senha deve ter no mínimo 6 caracteres',
      }),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: 'custom',
        message: 'senhas não conferem',
        path: ['passwordConfirmation'],
      });
    }
  });

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Login() {
  const router = useRouter();
  const session = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await api.post('/users/register', {
        email: data.email,
        password: data.password,
        name: data.fullName,
      });

      const loginResponse = await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/',
        redirect: false,
      });

      console.log('LOGIN RESPONSE');
      console.log(loginResponse);

      if (!loginResponse) {
        errorToast({
          message: 'algum erro aconteceu',
          description: 'tente novamente mais tarde',
        });

        return;
      }

      if (loginResponse.ok) {
        successToast({
          message: 'usuário criado com sucesso',
          description: 'aproveite a plataforma :)',
        });
        router.push('/');
      } else if (loginResponse.error === 'invalid-credentials') {
        errorToast({
          message: 'e-mail ou senha incorretos',
        });

        return;
      } else if (loginResponse.error === 'invalid-login-method') {
        errorToast({
          message: 'método de login inválido',
          description: 'tente fazer login usando o google',
        });

        return;
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.data) {
        if (err.response.data.code === 'user-already-exists') {
          errorToast({
            message: 'e-mail já cadastrado',
            description: 'tente fazer login ou recupere sua senha',
          });
          return;
        }
      }
      errorToast({
        message: 'falha ao criar usuário',
        description: 'tente novamente mais tarde',
      });
    }
  };

  const hasCalendarError = !!router.query.error;

  useEffect(() => {
    if (hasCalendarError) {
      errorToast({
        message: 'falha ao se conectar com o google',
        description:
          'veja se você habilitou as permissões de acesso ao google calendar',
      });
    }
  }, [hasCalendarError]);

  if (session.status === 'authenticated') {
    router.push('/');
  }

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-12 w-auto"
            src="/logo-yoga-com-kaka-roxo.png"
            alt="Logo grupo r3"
            width={300}
            height={100}
          />
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              crie sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              já possui uma conta?{' '}
              <Link
                href="/login"
                className="font-medium text-brand-purple-900 hover:text-brand-purple-800"
              >
                entre
              </Link>
            </p>
            <form
              className="mt-6 space-y-6"
              onSubmit={handleSubmit(handleRegister)}
            >
              <Input
                label="seu nome completo"
                type="text"
                errorMessage={errors.fullName?.message}
                {...register('fullName')}
              />

              <Input
                label="seu e-mail"
                type="email"
                errorMessage={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="sua senha"
                type="password"
                errorMessage={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="confirme sua senha"
                type="password"
                errorMessage={errors.passwordConfirmation?.message}
                {...register('passwordConfirmation')}
              />

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-brand-purple-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-purple-800 focus:outline-none"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 mt-4 h-4 w-4 animate-spin" />
                  ) : (
                    'criar conta'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">ou</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full">
                  <button
                    onClick={() => {
                      signIn('google', {
                        callbackUrl: '/',
                      });
                    }}
                    className={`flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-500 shadow-sm hover:bg-gray-50 ${
                      hasCalendarError
                        ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_17_40)">
                        <path
                          d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                          fill="#34A853"
                        />
                        <path
                          d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                          fill="#FBBC04"
                        />
                        <path
                          d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                          fill="#EA4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_17_40">
                          <rect width="48" height="48" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span className="ml-2 text-sm font-semibold">
                      criar conta com o google
                    </span>
                  </button>

                  {hasCalendarError && (
                    <p className="mt-2 text-sm text-red-600">
                      falha ao se conectar com o google. veja se você habilitou
                      as permissões de acesso ao google calendar
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

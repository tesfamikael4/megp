'use client';
import jwtDecode from 'jwt-decode';
import { hasCookie, deleteCookie, getCookie, setCookie } from 'cookies-next';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import z from 'zod';
import type {
  CheckSecurityQuestions,
  Login,
  Password,
  Reset,
  ResetByQue,
  SetSecurityQuestions,
  SignUp,
  Verify,
} from '../../models/auth';

interface AuthContextValue {
  user: Record<string, any> | undefined;
  isAuthenticated: boolean;
  error: any;
  isUser: () => boolean | undefined;
  signUp: (formFields: SignUp) => Promise<
    | {
        verificationId?: string;
        message?: string;
      }
    | undefined
  >;
  verify: (formFields: Verify) => Promise<
    | {
        is_security_question_set?: boolean;
        access_token?: string;
        refresh_token?: string;
        message?: string;
        statusCode?: number;
      }
    | undefined
  >;
  login: (formFields: Login) => Promise<
    | {
        is_security_question_set?: boolean;
        access_token?: string;
        refresh_token?: string;
        message?: string;
      }
    | undefined
  >;
  logOut: () => void;
  forgetPassword: (email: string) => Promise<
    | {
        message?: string;
        verificationId?: string;
      }
    | undefined
  >;
  verifyForgetPassword: (
    formFields: Verify,
  ) => Promise<{ statusCode?: number; status?: boolean } | undefined>;
  resetPassword: (
    reset: Reset,
  ) => Promise<{ message?: string; statusCode?: number } | undefined>;
  resetPasswordByQue: (reset: ResetByQue) => Promise<
    | {
        verificationId?: string;
        otp?: string;
        isOtp?: boolean;
        message?: string;
        statusCode?: number;
      }
    | undefined
  >;
  changePassword: (
    formFields: Password,
  ) => Promise<{ message?: string; statusCode?: number } | undefined>;
  setSecurityQuestions: (formFields: SetSecurityQuestions) => Promise<
    | {
        status?: boolean;
        message?: string;
        statusCode?: number;
      }
    | undefined
  >;
  getUserInfo: () => Promise<
    | {
        username?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        message?: string;
        user?: Record<string, any> | null;
      }
    | undefined
  >;
}

interface BuildFetchAPI {
  formFields:
    | CheckSecurityQuestions
    | Login
    | Password
    | Reset
    | ResetByQue
    | SetSecurityQuestions
    | SignUp
    | Verify
    | Record<string, string>
    | null;
  queryURL: string;
  method: 'GET' | 'POST';
}

type BuildFetchAPIResponse<T> = T;

const AuthContext = createContext<AuthContextValue | null>(null);

const baseURL = process.env.NEXT_PUBLIC_IAM_API;

function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<any>();
  const [error, setError] = useState<any>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isSignedIn = hasCookie('token');
    setIsAuthenticated(isSignedIn);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const token = getCookie('token');
      if (token) {
        const userInfo: Record<string, any> = jwtDecode(token);
        setUser(userInfo);
      }
    }
  }, [isAuthenticated]);

  const isUser = () => {
    return hasCookie('token');
  };

  const buildFetchAPI = async function <T>(
    params: BuildFetchAPI,
    schema: z.Schema<T>,
  ): Promise<BuildFetchAPIResponse<T> | undefined> {
    try {
      setError(undefined);
      const token = getCookie('token');
      const refreshToken = getCookie('refreshToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        const decoded: Record<string, any> = jwtDecode(token);
        // Check if the token is expired
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTimestamp) {
          // Token has expired, refresh it
          const refreshedToken: Record<string, string> | undefined =
            await fetch(`${baseURL}/auth/refresh-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`,
              },
              body: JSON.stringify({
                refresh_token: refreshToken,
              }),
            }).then(async (res) => {
              if (res.ok) {
                const data = await res.json();
                return data;
              }
              deleteCookie('token');
              deleteCookie('refreshToken');
            });

          if (refreshedToken) {
            headers.Authorization = `Bearer ${refreshedToken.access_token}`;
            setCookie('token', refreshedToken.access_token);
          } else {
            // Clear the cookie and log out the user
            deleteCookie('token');
            setIsAuthenticated(false);
            router.refresh();
          }
        } else {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const fetchConfig: Record<any, any> = {
        method: params.method, // Set the HTTP method
        headers,
      };

      if (params.method === 'POST') {
        fetchConfig.body = JSON.stringify(params.formFields);
      }

      const response = await fetch(
        `${baseURL}/auth/${params.queryURL}`,
        fetchConfig,
      );

      return response.json().then((data) => {
        return schema.parse(data);
      });
    } catch (err) {
      setError(err);
    }
  };

  const signUp = async (formFields: SignUp) => {
    const response = await buildFetchAPI(
      {
        formFields,
        queryURL: 'signup',
        method: 'POST',
      },
      z.object({
        verificationId: z.string().optional(),
        message: z.string().optional(),
      }),
    );
    return response;
  };

  const login = async (formFields: Login) => {
    const response = await buildFetchAPI(
      {
        formFields,
        queryURL: 'login',
        method: 'POST',
      },
      z.object({
        access_token: z.string().optional(),
        refresh_token: z.string().optional(),
        message: z.string().optional(),
        is_security_question_set: z.boolean().optional(),
      }),
    );
    return response;
  };

  const verify = async (formFields: Verify) => {
    const response = await buildFetchAPI(
      {
        formFields,
        queryURL: 'verify',
        method: 'POST',
      },
      z.object({
        is_security_question_set: z.boolean().optional(),
        access_token: z.string().optional(),
        refresh_token: z.string().optional(),
        message: z.string().optional(),
        statusCode: z.number().optional(),
      }),
    );
    return response;
  };

  const forgetPassword = async (email: string) => {
    const response = await buildFetchAPI(
      {
        formFields: { email },
        queryURL: 'forget-password',
        method: 'POST',
      },
      z.object({
        message: z.string().optional(),
        verificationId: z.string().optional(),
      }),
    );

    return response;
  };

  const verifyForgetPassword = async (formFields: Verify) => {
    const response = await buildFetchAPI(
      {
        formFields,
        queryURL: 'verify-forget-password',
        method: 'POST',
      },
      z.object({
        statusCode: z.number().optional(),
        status: z.boolean().optional(),
      }),
    );

    return response;
  };

  const resetPassword = async (reset: Reset) => {
    const response = await buildFetchAPI(
      {
        formFields: reset,
        queryURL: 'reset-password',
        method: 'POST',
      },
      z.object({
        message: z.string().optional(),
        statusCode: z.number().optional(),
      }),
    );

    return response;
  };

  const resetPasswordByQue = async (reset: ResetByQue) => {
    const response = await buildFetchAPI(
      {
        formFields: reset,
        queryURL: 'reset-password-with-security-questions',
        method: 'POST',
      },
      z.object({
        verificationId: z.string().optional(),
        otp: z.string().optional(),
        isOtp: z.boolean().optional(),
        message: z.string().optional(),
        statusCode: z.number().optional(),
      }),
    );

    return response;
  };

  const changePassword = async (formFields: Password) => {
    const response = await buildFetchAPI(
      {
        formFields,
        queryURL: 'change-password',
        method: 'POST',
      },
      z.object({
        message: z.string().optional(),
        statusCode: z.number().optional(),
      }),
    );

    return response;
  };

  const setSecurityQuestions = async (formFields: SetSecurityQuestions) => {
    const response = await buildFetchAPI(
      {
        formFields,
        queryURL: 'set-security-questions',
        method: 'POST',
      },
      z.object({
        status: z.boolean().optional(),
        message: z.string().optional(),
        statusCode: z.number().optional(),
      }),
    );

    return response;
  };

  const getUserInfo = async () => {
    const response = await buildFetchAPI(
      {
        formFields: null,
        queryURL: 'me',
        method: 'GET',
      },
      z.object({
        username: z.string().optional(),
        email: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        message: z.string().optional(),
        phone: z.string().optional(),
        user: z.object({ userRoles: z.any() }).optional().nullable(),
      }),
    );
    return response;
  };

  const logOut = () => {
    deleteCookie('token');
    deleteCookie('refreshToken');
    router.refresh();
  };

  const authContextValue = {
    user,
    isAuthenticated,
    error,
    isUser,
    signUp,
    verify,
    login,
    logOut,
    forgetPassword,
    verifyForgetPassword,
    changePassword,
    resetPassword,
    resetPasswordByQue,
    setSecurityQuestions,
    getUserInfo,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };

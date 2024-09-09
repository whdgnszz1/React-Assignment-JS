import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { EMAIL_PATTERN } from '@/constants';
import { auth } from '@/firebase';
import { setIsLogin } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleClickRegister = () => {
    navigate(pageRoutes.register);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!email) {
      formErrors.email = '이메일을 입력하세요';
    } else if (!EMAIL_PATTERN.test(email)) {
      formErrors.email = '이메일 양식이 올바르지 않습니다';
    }
    if (!password) {
      formErrors.password = '비밀번호를 입력하세요';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleClickLoginButton = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log(user);
        dispatch(setIsLogin(true));

        navigate(location.state?.prevPath ?? pageRoutes.main);
      } catch (error) {
        console.error('Login error:', error);
        setErrors({
          form: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
        });
      }
    }
  };

  return (
    <div className="w-full h-screen max-w-md mx-auto mt-8 space-y-8 flex flex-col justify-center">
      <form onSubmit={handleClickLoginButton} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              type="email"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="password"
              type="password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
        <Button type="submit" className="w-full" aria-label="로그인">
          로그인
        </Button>
      </form>
      <Button
        variant="outline"
        className="w-full"
        onClick={handleClickRegister}
      >
        회원가입
      </Button>
    </div>
  );
};

export default LoginPage;

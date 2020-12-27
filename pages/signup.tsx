import 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Contained } from '../components/Contained';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/auth';

function Signup() {
  const router = useRouter();
  const { createUser } = useAuth();

  const [email, setEmail] = useState(undefined as string | undefined);
  const [password, setPassword] = useState(undefined as string | undefined);
  const [displayName, setDisplayName] = useState(
    undefined as string | undefined,
  );

  const handleSubmit = async () => {
    if (!(displayName && email && password)) {
      return;
    }

    // Todo verify
    try {
      await createUser(displayName, email, password);
      router.push('/account');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Contained>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-6">
          <div>
            <label htmlFor="email" className="text-twoxl">
              Name
            </label>
            <Input
              id="displayName"
              type="text"
              name="displayName"
              size="large"
              placeholder="Gordon Ramsay"
              onValueChange={value => setDisplayName(value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-twoxl">
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              size="large"
              placeholder="jerry@tastiest.io"
              onValueChange={value => setEmail(value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="text-twoxl">
              Password
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              size="large"
              placeholder="*********"
              onValueChange={value => setPassword(value)}
            />
          </div>

          <div className="flex space-x-4 mt-4">
            <div className="w-1/2">
              <Button type="ghost" size="small" onClick={handleSubmit}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Contained>
  );
}

export default Signup;

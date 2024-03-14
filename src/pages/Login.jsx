import React from 'react';
import { Login as LoginComponent } from "../Components";

function Login() {
  return (
    <div className="py-0 flex flex-col items-center">
      <LoginComponent />
      <div className="text-center">
        <b>Just curious?</b> Use the following test-credentials to login:
      </div>
      <div className="bg-gray-100 p-4 rounded-lg text-left text-black">
        <p><span className="font-semibold">Email:</span> talentseeker.logincheck@gmail.com</p>
        <p><span className="font-semibold">Password:</span> 12345678</p>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import axios from 'axios';

export default function AuthForm({ api, onAuth }){
  const [mode, setMode] = useState('login'); // or register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'register') {
        const res = await axios.post(`${api}/api/auth/register`, { name, email, password });
        onAuth(res.data.token, res.data.user);
      } else {
        const res = await axios.post(`${api}/api/auth/login`, { email, password });
        onAuth(res.data.token, res.data.user);
      }
      setPassword('');
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <button onClick={()=>setMode('login')} className={mode==='login' ? '' : 'button-ghost'}>Login</button>
        <button onClick={()=>setMode('register')} className={mode==='register' ? '' : 'button-ghost'}>Register</button>
      </div>
      <form onSubmit={submit}>
        {mode==='register' ? <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required /> : null}
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">{mode==='login' ? 'Login' : 'Create Account'}</button>
      </form>
    </div>
  );
}

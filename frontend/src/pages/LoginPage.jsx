import { redirect } from 'react-router-dom';
import Login from '../components/Login';
import { authService } from '../services/authService';
import { setToken } from '../util/auth';

export default function LoginPage() {
  return <Login />;
}

export async function action({ request }) {
  const data = await request.formData();
  try {
    const res = await authService.login(data.get('username'), data.get('password'));
    setToken(res.token);
    return redirect('/');
  } catch (err) {
    return { error: err.message };
  }
}

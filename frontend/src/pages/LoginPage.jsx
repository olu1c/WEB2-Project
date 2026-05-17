import { redirect } from 'react-router-dom';
import Login from '../components/Login';
import { authService } from '../services/authService';
import { setToken } from '../util/auth';

export default function LoginPage() {
  return <Login />;
}

export async function action({ request }) {
  const data = await request.formData();
  const from = data.get('from') || '/';
  try {
    const res = await authService.login(data.get('username'), data.get('password'));
    setToken(res.token);
    return redirect(from);
  } catch (err) {
    const status = err.response?.status;
    if (status === 401) return { error: 'Invalid username or password.' };
    return { error: 'Something went wrong. Please try again.' };
  }
}

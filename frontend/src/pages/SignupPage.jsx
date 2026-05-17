import { redirect } from 'react-router-dom';
import Signup from '../components/Signup';
import { authService } from '../services/authService';

export default function SignupPage() {
  return <Signup />;
}

export async function action({ request }) {
  const data = await request.formData();
  try {
    await authService.register(data.get('username'), data.get('email'), data.get('password'));
    return redirect('/login');
  } catch (err) {
    const status = err.response?.status;
    const msg = err.response?.data;
    if (status === 400) {
      if (typeof msg === 'string' && msg.toLowerCase().includes('username')) return { error: 'Username already exists.' };
      if (typeof msg === 'string' && msg.toLowerCase().includes('email')) return { error: 'Email is already in use.' };
      return { error: 'Invalid registration data.' };
    }
    return { error: 'Something went wrong. Please try again.' };
  }
}

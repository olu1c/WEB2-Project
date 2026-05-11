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
    return { error: err.message };
  }
}

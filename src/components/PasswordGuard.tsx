import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordGuardProps {
  correctPassword: string;
  onAuthenticated: () => void;
}

export function PasswordGuard({ correctPassword, onAuthenticated }: PasswordGuardProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onAuthenticated();
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-red-900/50 p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-red-950/50 p-3 rounded-full border border-red-900/50">
              <Lock className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h2>
          <p className="text-gray-400 text-center mb-6">Enter password to manage UTM settings</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter password"
                className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-red-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-300 text-sm mt-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

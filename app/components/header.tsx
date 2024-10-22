import { Command } from 'lucide-react';
import { Link } from '@remix-run/react';

export const Header = () => {
  return (
    <nav className="flex items-center justify-between p-4 w-full border-b">
      <Link to="/" className="flex items-center space-x-2">
        <Command className="h-8 w-8" />
        <h2 className="text-xl font-semibold">Sky-UI</h2>
      </Link>
      {/* <ThemeToggle /> */}
    </nav>
  );
};

'use client';
import Organizations from '../detail/[Id]/organizations';
import '../../globals.css';
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-auto">
      <div className="">{children}</div>
    </div>
  );
}

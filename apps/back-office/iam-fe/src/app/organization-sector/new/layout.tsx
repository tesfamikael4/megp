'use client';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-auto">
      <div className="">{children}</div>
    </div>
  );
}

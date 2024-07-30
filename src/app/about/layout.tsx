export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center p-4">
      <main className="relative pt-20">{children}</main>
    </div>
  );
}

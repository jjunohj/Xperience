export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center">
      <main className="relative mt-14 w-full sm:mt-[5.5rem]">{children}</main>
    </div>
  );
}

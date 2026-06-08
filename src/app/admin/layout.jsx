import AdminSidebar from '@/components/layout/AdminSidebar';

export const metadata = {
  title: 'Panel Administrativo',
};

export default function AdminLayout({ children }) {
  return (
    <>
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }
        .admin-main {
          flex: 1;
          margin-left: 280px;
          padding: 2rem;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 100vh;
        }
        @media (max-width: 768px) {
          .admin-main {
            margin-left: 0;
            padding: 1rem;
          }
        }
      `}</style>

      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </>
  );
}

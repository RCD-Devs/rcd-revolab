import AdminPage from "@/components/admin/admin-page";

export const metadata = {
  title: "Panel de Administración",
  description: "Gestión de usuarios y cursos de la plataforma RevoLab.",
};

export default function AdminRoute() {
  return <AdminPage />;
}

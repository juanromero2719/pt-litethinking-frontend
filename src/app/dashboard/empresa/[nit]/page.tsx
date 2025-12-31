import LogoutButton from "@/components/organisms/LogoutButton";
import { getUserRole } from "@/lib/auth/getUserRole";
import EmpresaProductosList from "@/components/organisms/EmpresaProductosList";

type PageProps = {
  params: Promise<{ nit: string }>;
};

export default async function EmpresaProductosPage({ params }: PageProps) {
  const { nit } = await params;
  const role = await getUserRole();

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-[#2C3E50]">Productos de la Empresa</h1>
              <p className="text-sm text-[#6C757D] mt-1">
                NIT: {nit}
              </p>
              {role && (
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E8F4FD] text-[#4A90E2]">
                  Rol: {role}
                </div>
              )}
            </div>
            <LogoutButton />
          </div>
          
          <div className="border-t border-[#E1E8ED] pt-6">
            <EmpresaProductosList nit={nit} />
          </div>
        </div>
      </div>
    </div>
  );
}

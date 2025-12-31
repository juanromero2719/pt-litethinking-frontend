# Arquitectura de Peticiones al Backend

Este documento explica cómo crear peticiones al backend siguiendo Clean Architecture en el frontend.

## Estructura de Capas

```
src/
├── domain/           # Capa de Dominio (Entidades y Contratos)
│   └── empresa/
│       ├── entities.ts    # Entidades del dominio
│       └── ports.ts       # Interfaces/Contratos (Puertos)
│
├── data/            # Capa de Datos (Adapters de Infraestructura)
│   └── empresa/
│       └── nextEmpresaRepository.ts  # Adapter que implementa el puerto
│
├── application/     # Capa de Aplicación (Casos de Uso y Hooks)
│   └── empresa/
│       └── useEmpresas.ts  # Hook que usa el adapter
│
├── app/api/         # Next.js API Routes (Proxy al Backend)
│   └── empresas/
│       ├── route.ts        # GET /api/empresas, POST /api/empresas
│       └── [nit]/route.ts  # GET/PUT/DELETE /api/empresas/:nit
│
└── components/      # Capa de Presentación (UI)
    └── organisms/
        └── EmpresasList/   # Componente que usa el hook
```

## Flujo de Datos

```
Componente (UI)
    ↓ usa
Hook (Application Layer)
    ↓ usa
Adapter/Repository (Data Layer)
    ↓ llama
Next.js API Route (Proxy)
    ↓ llama
Django Backend
```

## 1. Domain Layer (Entidades y Puertos)

### `domain/empresa/entities.ts`
Define las entidades del dominio y validaciones.

```typescript
export type Empresa = {
  nit: string;
  nombre: string;
  direccion: string;
  telefono: string;
};
```

### `domain/empresa/ports.ts`
Define el **puerto** (interfaz) que debe implementar cualquier adapter.

```typescript
export interface EmpresaRepository {
  listar(): Promise<Empresa[]>;
  obtenerPorNit(nit: string): Promise<Empresa | null>;
  crear(empresa: Omit<Empresa, "nit"> & { nit: string }): Promise<Empresa>;
  actualizar(nit: string, empresa: Partial<Omit<Empresa, "nit">>): Promise<Empresa>;
  eliminar(nit: string): Promise<void>;
}
```

**¿Qué es un puerto?**
- Es una interfaz que define **QUÉ** se necesita hacer, no **CÓMO**.
- Permite cambiar la implementación sin afectar el resto del código.
- Sigue el principio de Inversión de Dependencias (DIP).

## 2. Data Layer (Adapters)

### `data/empresa/nextEmpresaRepository.ts`
Es el **adapter** que implementa el puerto del dominio.

```typescript
export const nextEmpresaRepository: EmpresaRepository = {
  async listar(): Promise<Empresa[]> {
    const response = await api.get("/empresas");
    return response.data;
  },
  // ... otros métodos
};
```

**¿Qué es un adapter?**
- Adapta la infraestructura (Next.js API routes, axios) a las interfaces del dominio.
- Puede haber múltiples adapters: `nextEmpresaRepository`, `mockEmpresaRepository`, `localStorageEmpresaRepository`, etc.
- El dominio no conoce la implementación, solo el contrato.

## 3. Application Layer (Hooks)

### `application/empresa/useEmpresas.ts`
Es un **hook** que encapsula la lógica de negocio y el estado de React.

```typescript
export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEmpresas = async () => {
    const data = await nextEmpresaRepository.listar();
    setEmpresas(data);
  };

  return { empresas, loading, error, recargar: cargarEmpresas };
}
```

**¿Qué es un hook en esta arquitectura?**
- Es un **presenter/adapter** que adapta el estado de React a la lógica de negocio.
- Encapsula la lógica de casos de uso (cargar datos, manejar errores, estados de carga).
- Los componentes solo consumen el hook, no conocen el adapter directamente.

## 4. Presentation Layer (Componentes)

### `components/organisms/EmpresasList/EmpresasList.tsx`
El componente UI que usa el hook.

```typescript
export default function EmpresasList() {
  const { empresas, loading, error, recargar } = useEmpresas();
  
  // Renderiza la UI
}
```

## 5. Infrastructure Layer (API Routes)

### `app/api/empresas/route.ts`
Next.js API routes que actúan como **proxy** al backend Django.

```typescript
export async function GET() {
  const client = await getDjangoAuthClient();
  const r = await client.get("/api/empresas/");
  return NextResponse.json(r.data);
}
```

**¿Por qué usar API routes?**
- Manejan la autenticación (cookies httpOnly).
- Proporcionan una capa de abstracción adicional.
- Permiten transformar datos antes de enviarlos al cliente.

## Ejemplo Completo: Listar Empresas

### Paso 1: Definir la Entidad
```typescript
// domain/empresa/entities.ts
export type Empresa = {
  nit: string;
  nombre: string;
  direccion: string;
  telefono: string;
};
```

### Paso 2: Definir el Puerto
```typescript
// domain/empresa/ports.ts
export interface EmpresaRepository {
  listar(): Promise<Empresa[]>;
}
```

### Paso 3: Crear el Adapter
```typescript
// data/empresa/nextEmpresaRepository.ts
export const nextEmpresaRepository: EmpresaRepository = {
  async listar(): Promise<Empresa[]> {
    const response = await api.get("/empresas");
    return response.data;
  },
};
```

### Paso 4: Crear el Hook
```typescript
// application/empresa/useEmpresas.ts
export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const cargarEmpresas = async () => {
    const data = await nextEmpresaRepository.listar();
    setEmpresas(data);
  };
  return { empresas, cargarEmpresas };
}
```

### Paso 5: Usar en el Componente
```typescript
// components/organisms/EmpresasList/EmpresasList.tsx
export default function EmpresasList() {
  const { empresas } = useEmpresas();
  return <div>{/* Render empresas */}</div>;
}
```

## Ventajas de esta Arquitectura

1. **Testabilidad**: Puedes crear mocks del adapter fácilmente.
2. **Mantenibilidad**: Cambios en la API solo afectan el adapter.
3. **Reutilización**: El hook puede usarse en múltiples componentes.
4. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad clara.
5. **Flexibilidad**: Puedes cambiar de Next.js a otro framework sin afectar el dominio.

## Resumen de Conceptos

- **Puerto (Port)**: Interfaz que define el contrato.
- **Adapter**: Implementación concreta del puerto.
- **Hook**: Presenter que adapta React al dominio.
- **Repository**: Patrón que abstrae el acceso a datos (el adapter es un repository).

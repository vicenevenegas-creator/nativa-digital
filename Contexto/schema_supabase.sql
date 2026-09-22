-- Habilitar extensión para UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS " uuid-ossp\;

-- 1. Tabla de Usuarios (equipo de la empresa)
CREATE TABLE usuarios (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 email TEXT UNIQUE NOT NULL,
 nombre TEXT NOT NULL,
 rol TEXT NOT NULL DEFAULT 'admin',
 creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Marcas de Bomba
CREATE TABLE marcas_bomba (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 nombre TEXT NOT NULL UNIQUE
);

-- 3. Tabla de Modelos de Bomba
CREATE TABLE modelos_bomba (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 marca_id UUID NOT NULL REFERENCES marcas_bomba(id) ON DELETE CASCADE,
 nombre_modelo TEXT NOT NULL,
 diametro_eje TEXT
);

-- 4. Tabla de Fluidos
CREATE TABLE fluidos (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 nombre TEXT NOT NULL UNIQUE
);

-- 5. Tabla de Sellos Mecánicos (Catálogo de repuestos)
CREATE TABLE sellos_mecanicos (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 codigo_referencia TEXT NOT NULL,
 marca_sello TEXT NOT NULL,
 material_caras TEXT,
 material_elastomero TEXT,
 link_tiendanube TEXT
);

-- 6. Tabla de Compatibilidades (Matcheo muchos a muchos)
CREATE TABLE compatibilidades (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 modelo_bomba_id UUID NOT NULL REFERENCES modelos_bomba(id) ON DELETE CASCADE,
 fluido_id UUID NOT NULL REFERENCES fluidos(id) ON DELETE CASCADE,
 sello_id UUID NOT NULL REFERENCES sellos_mecanicos(id) ON DELETE CASCADE
);

-- 7. Tabla de Consultas / Leads
CREATE TABLE consultas_leads (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 modelo_bomba_id UUID REFERENCES modelos_bomba(id) ON DELETE SET NULL,
 fluido_id UUID REFERENCES fluidos(id) ON DELETE SET NULL,
 sello_id UUID REFERENCES sellos_mecanicos(id) ON DELETE SET NULL,
 nombre_contacto TEXT NOT NULL,
 telefono_contacto TEXT NOT NULL
);

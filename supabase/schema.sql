-- BETO BALTAZAR CORRETOR — Schema Completo
-- Execute no Supabase: SQL Editor → New Query → Run

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, cpf TEXT, rg TEXT, phone TEXT, email TEXT, address TEXT, bank_info TEXT, notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, cpf TEXT, rg TEXT, phone TEXT, email TEXT, address TEXT, emergency_contact TEXT, notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE, title TEXT NOT NULL, type TEXT NOT NULL, purpose TEXT NOT NULL,
  status TEXT DEFAULT 'Disponível', price NUMERIC DEFAULT 0, rent NUMERIC DEFAULT 0,
  area NUMERIC DEFAULT 0, lot_area NUMERIC DEFAULT 0, bedrooms INT DEFAULT 0,
  suites INT DEFAULT 0, bathrooms INT DEFAULT 0, parking INT DEFAULT 0,
  address TEXT, neighborhood TEXT, city TEXT DEFAULT 'Capão Bonito', state TEXT DEFAULT 'SP', cep TEXT,
  description TEXT, features TEXT[] DEFAULT '{}', photos TEXT[] DEFAULT '{}', portals TEXT[] DEFAULT '{}',
  iptu NUMERIC DEFAULT 0, condo_fee NUMERIC DEFAULT 0, owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE, is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION check_property_limit() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM properties) >= 50 THEN
    RAISE EXCEPTION 'Limite de 50 imóveis cadastrados atingido';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_property_limit BEFORE INSERT ON properties FOR EACH ROW EXECUTE FUNCTION check_property_limit();

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  contract_type TEXT DEFAULT 'Locação Residencial', rent_value NUMERIC NOT NULL,
  deposit NUMERIC DEFAULT 0, readjustment_index TEXT DEFAULT 'IGPM',
  start_date DATE NOT NULL, end_date DATE NOT NULL, payment_day INT DEFAULT 10,
  status TEXT DEFAULT 'Ativo', clauses TEXT, pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE boletos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  value NUMERIC NOT NULL, due_date DATE NOT NULL, paid_date DATE,
  status TEXT DEFAULT 'Pendente', pix_code TEXT, notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, phone TEXT, email TEXT, interest TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  stage TEXT DEFAULT 'Novo Lead', source TEXT DEFAULT 'Site',
  deal_value NUMERIC DEFAULT 0, notes TEXT,
  last_contact_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT,
  property_type TEXT, purpose TEXT, property_address TEXT, property_details TEXT, message TEXT,
  attachments TEXT[] DEFAULT '{}', status TEXT DEFAULT 'Novo',
  converted_to_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  inspection_type TEXT DEFAULT 'Entrada', inspection_date DATE NOT NULL,
  inspector_name TEXT DEFAULT 'Beto Baltazar', status TEXT DEFAULT 'Em Andamento',
  general_notes TEXT, pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT, entity_id UUID, action TEXT, description TEXT, metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at triggers
CREATE OR REPLACE FUNCTION trg_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER owners_updated BEFORE UPDATE ON owners FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER tenants_updated BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER properties_updated BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER contracts_updated BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER boletos_updated BEFORE UPDATE ON boletos FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER inspections_updated BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION trg_updated_at();

-- RLS
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE boletos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Imóveis publicados são públicos" ON properties FOR SELECT TO anon USING (is_published = TRUE);
CREATE POLICY "Público pode criar submissões" ON submissions FOR INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY "Auth total owners" ON owners FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth total tenants" ON tenants FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth total properties" ON properties FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth total contracts" ON contracts FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth total boletos" ON boletos FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth total leads" ON leads FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth total submissions" ON submissions FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth total inspections" ON inspections FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth total activities" ON activities FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('property-photos','property-photos',TRUE),('submission-files','submission-files',FALSE) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Fotos públicas" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'property-photos');
CREATE POLICY "Anon upload submissions" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'submission-files');
CREATE POLICY "Auth storage total" ON storage.objects FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Seed data
INSERT INTO owners (name, phone, email) VALUES ('Carlos Alberto Silva','(15) 99999-1111','carlos@email.com');
INSERT INTO properties (code, title, type, purpose, price, area, bedrooms, bathrooms, parking, neighborhood, city, description, is_featured, is_published) VALUES
  ('001','Casa Térrea de Alto Padrão no Centro','Casa','Venda',990000,174,3,3,2,'Centro','Capão Bonito','Linda casa térrea no centro da cidade. 3 dormitórios sendo 2 suítes, ampla sala integrada, cozinha americana planejada, área gourmet com churrasqueira e piscina.',TRUE,TRUE),
  ('002','Casa com Edícula na Av. Amazonas','Casa','Venda',270000,114,3,2,1,'Vila Bela Vista','Capão Bonito','Casa com edícula, 3 dormitórios, sala ampla, cozinha, banheiro social, área de serviço.',TRUE,TRUE),
  ('003','Ponto Comercial com Casa','Comercial','Venda',420000,300,2,2,4,'Vila Bela Vista','Capão Bonito','Excelente ponto comercial com casa nova nos fundos. Terreno 300m².',TRUE,TRUE);

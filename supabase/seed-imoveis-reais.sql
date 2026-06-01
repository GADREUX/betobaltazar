-- ═══════════════════════════════════════════════════════════════
-- IMÓVEIS REAIS DO BETO BALTAZAR
-- Extraídos de betobaltazarcorretor.com.br em 31/05/2026
-- Execute no Supabase: SQL Editor → New Query → Run
-- ATENÇÃO: Apaga os imóveis de exemplo antes de inserir os reais
-- ═══════════════════════════════════════════════════════════════

-- 1. Limpa os imóveis de exemplo (seed data)
DELETE FROM properties WHERE code IN ('001', '002', '003');

-- 2. Insere os imóveis reais
INSERT INTO properties (
  code, title, type, purpose, status, price, area, lot_area,
  bedrooms, suites, bathrooms, parking,
  neighborhood, city, state,
  description, photos, is_featured, is_published
) VALUES

-- Código 1 — Casa Centro Capão Bonito R$ 990.000
(
  '1',
  'Casa Térrea de Alto Padrão no Centro',
  'Casa',
  'Venda',
  'Disponível',
  990000,
  174,
  224,
  3, 2, 1, 2,
  'Centro', 'Capão Bonito', 'SP',
  'Casa Térrea para Venda no bairro Centro, 3 dormitórios sendo 2 suítes, 2 vagas, 174m² de área construída em terreno de 224m². Frente: 8,5m, Fundo: 25m, Lado direito: 25m, Lado esquerdo: 25m.',
  ARRAY[
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp1328930224.jpg',
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp1943939911.jpg',
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp114021453.jpg',
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp557326221.jpg',
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp1971428251.jpg',
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp1864388129.jpg',
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp1118065845.jpg',
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp726778755.jpg',
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp102863776.jpg',
    'https://imonuvem.com.br/imovel/95/5004/casa-venda-centro-smp41658631.jpg'
  ],
  TRUE, TRUE
),

-- Código 4 — Ponto Comercial Vila Bela Vista R$ 420.000
(
  '4',
  'Ponto Comercial com Casa Nova',
  'Comercial',
  'Venda',
  'Disponível',
  420000,
  300,
  300,
  2, 0, 2, 4,
  'Vila Bela Vista', 'Capão Bonito', 'SP',
  'Ponto Comercial com casa nova em área de 300m². Excelente localização, alto fluxo de pessoas. Inclui casa nova nos fundos com 2 dormitórios.',
  ARRAY[]::TEXT[],
  TRUE, TRUE
),

-- Código 5 — Terreno Centro R$ 125.000
(
  '5',
  'Terreno no Bairro Santa Isabel',
  'Terreno',
  'Venda',
  'Disponível',
  125000,
  545,
  545,
  0, 0, 0, 0,
  'Centro', 'Capão Bonito', 'SP',
  'Terreno para Venda no bairro Santa Isabel, 545m². Ótima oportunidade para construção ou investimento.',
  ARRAY[]::TEXT[],
  FALSE, TRUE
),

-- Código 6 — Terreno Vila Nova R$ 88.000
(
  '6',
  'Terreno Vila Nova Capão Bonito',
  'Terreno',
  'Venda',
  'Disponível',
  88000,
  160,
  160,
  0, 0, 0, 0,
  'Vila Nova Capão Bonito', 'Capão Bonito', 'SP',
  'Terreno para Venda no bairro Vila Nova Capão Bonito, 160m². IPTU: R$ 400,00/ano.',
  ARRAY[]::TEXT[],
  FALSE, TRUE
),

-- Código 8 — Casa Itapetininga R$ 350.000
(
  '8',
  'Casa à Venda em Itapetininga — Estuda Troca',
  'Casa',
  'Venda',
  'Disponível',
  350000,
  0,
  0,
  3, 1, 1, 2,
  'Santana', 'Itapetininga', 'SP',
  'Casa à venda em Itapetininga, bairro Santana. 3 dormitórios sendo 1 suíte, 2 vagas. Aceita troca por casa em Capão Bonito.',
  ARRAY[
    'https://imonuvem.com.br/imovel/95/5014/casa-venda-santana-smp1273125100.jpg',
    'https://imonuvem.com.br/imovel/95/5014/casa-venda-santana-smp1251489620.jpg',
    'https://imonuvem.com.br/imovel/95/5014/casa-venda-santana-smp1205691935.jpg',
    'https://imonuvem.com.br/imovel/95/5014/casa-venda-santana-smp853898037.jpg',
    'https://imonuvem.com.br/imovel/95/5014/casa-venda-santana-smp1317051326.jpg',
    'https://imonuvem.com.br/imovel/95/5014/casa-venda-santana-smp1154111699.jpg',
    'https://imonuvem.com.br/imovel/95/5014/casa-venda-santana-smp215580380.jpg',
    'https://imonuvem.com.br/imovel/95/5014/casa-venda-santana-smp96320807.jpg'
  ],
  FALSE, TRUE
),

-- Código 10 — Casa Vila Nova R$ 350.000
(
  '10',
  'Casa Térrea Vila Nova Capão Bonito',
  'Casa',
  'Venda',
  'Disponível',
  350000,
  100,
  340,
  3, 0, 1, 4,
  'Vila Nova Capão Bonito', 'Capão Bonito', 'SP',
  'Casa Térrea para Venda no bairro Vila Nova Capão Bonito, 3 dormitórios, 4 vagas, 100m² de área construída em terreno de 340m².',
  ARRAY[]::TEXT[],
  FALSE, TRUE
),

-- Código 11 — Casa Vila Bela Vista R$ 380.000
(
  '11',
  'Casa Vila Bela Vista — Oportunidade',
  'Casa',
  'Venda',
  'Disponível',
  380000,
  0,
  0,
  2, 0, 1, 1,
  'Vila Bela Vista', 'Capão Bonito', 'SP',
  'Casa para Venda no bairro Vila Bela Vista, 2 dormitórios, 1 vaga. IPTU: R$ 1.100,00/ano. Ótima oportunidade.',
  ARRAY[]::TEXT[],
  TRUE, TRUE
),

-- Código 12 — Sítio Ribeirão Grande R$ 350.000
(
  '12',
  'Sítio no Bairro Mato Dentro — Ribeirão Grande',
  'Rural',
  'Venda',
  'Disponível',
  350000,
  90,
  0,
  2, 0, 1, 3,
  'Mato Dentro', 'Ribeirão Grande', 'SP',
  'Sítio para Venda no bairro Mato Dentro, 2 dormitórios, 3 vagas, 90m² de área construída em 11 tarefas de terra.',
  ARRAY[]::TEXT[],
  FALSE, TRUE
),

-- Código 13 — Casa JD Colonial R$ 270.000
(
  '13',
  'Casa Térrea Jardim Colonial',
  'Casa',
  'Venda',
  'Disponível',
  270000,
  88,
  150,
  2, 0, 1, 1,
  'JD.COLONIAL', 'Capão Bonito', 'SP',
  'Casa Térrea para Venda no Jardim Colonial, 2 dormitórios, 1 vaga, 88m² de área construída em terreno de 150m².',
  ARRAY[]::TEXT[],
  FALSE, TRUE
);

-- 3. Confirma
SELECT code, title, city, price, is_featured FROM properties ORDER BY code::int;

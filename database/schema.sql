-- =============================================================
--  PIÑATERÍA ML — Database Script
--  Engine: MySQL 8+ / MariaDB 10.5+
--  Description: Web catalog for party supplies and decorations
--               with support for the admin panel
-- =============================================================

-- -------------------------------------------------------------
-- 1. CREATE DATABASE
-- -------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS pinateriaml
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pinateriaml;

-- -------------------------------------------------------------
-- 2. TABLE: categories
--    Stores catalog categories shown in the website sidebar.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(60)      NOT NULL COMMENT 'URL identifier, e.g.: globos, pinatas',
  name          VARCHAR(100)     NOT NULL,
  icon          VARCHAR(80)      NOT NULL COMMENT 'Bootstrap Icon class, e.g.: bi-balloon-fill',
  sort_order    TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Position in the sidebar',
  active        TINYINT(1)       NOT NULL DEFAULT 1,
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catalog categories for the party supply store';

-- -------------------------------------------------------------
-- 3. TABLE: products
--    Each row is an item visible on the website.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id              INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  name            VARCHAR(150)      NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2)     NOT NULL DEFAULT 0.00,
  image_url       VARCHAR(500)      COMMENT 'Absolute URL or relative path /uploads/...',
  category_id     INT UNSIGNED      NOT NULL,
  badge_text      VARCHAR(60)       DEFAULT NULL COMMENT 'e.g.: Mas Vendido, Nuevo, Oferta',
  badge_type      ENUM(
                    'popular',
                    'new',
                    'sale',
                    'custom',
                    'special'
                  )                 DEFAULT NULL,
  stock_available TINYINT(1)        NOT NULL DEFAULT 1,
  active          TINYINT(1)        NOT NULL DEFAULT 1 COMMENT '0 = hidden on the website',
  sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Display order in the product grid',
  created_at      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_products_category (category_id),
  KEY idx_products_active   (active),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Products for the party supply and decoration catalog';

-- -------------------------------------------------------------
-- 4. TABLE: configuration
--    General store parameters editable from the admin panel.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS configuration (
  setting_key   VARCHAR(80)   NOT NULL,
  value         TEXT,
  description   VARCHAR(255)  COMMENT 'Help text for the admin panel',
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='General store configuration settings';

-- -------------------------------------------------------------
-- 5. TABLE: admin_users
--    Users with access to the admin panel.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL COMMENT 'bcrypt hash — never store plain text',
  role          ENUM('superadmin','editor') NOT NULL DEFAULT 'editor',
  active        TINYINT(1)    NOT NULL DEFAULT 1,
  last_login    DATETIME      DEFAULT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Admin panel users';

-- =============================================================
-- SEED DATA
-- =============================================================

-- -------------------------------------------------------------
-- 6. INSERT CATEGORIES
-- -------------------------------------------------------------
INSERT INTO categories (slug, name, icon, sort_order) VALUES
  ('globos',       'Globos',                 'bi-balloon-fill',      1),
  ('pinatas',      'Piñatas',                'bi-star-fill',         2),
  ('decoracion',   'Decoración General',     'bi-flower1',           3),
  ('centros-mesa', 'Centros de Mesa',        'bi-table',             4),
  ('pancartas',    'Pancartas & Banderines', 'bi-flag-fill',         5),
  ('cotillon',     'Cotillón & Artículos',   'bi-gift-fill',         6),
  ('papeleria',    'Papelería de Fiesta',    'bi-bag-heart-fill',    7),
  ('infantil',     'Temáticas Infantiles',   'bi-emoji-smile-fill',  8),
  ('quinceañera',  'Quinceañera & XV',       'bi-gem',               9),
  ('bodas',        'Bodas & Eventos',        'bi-heart-fill',       10);

-- -------------------------------------------------------------
-- 7. INSERT PRODUCTS
-- -------------------------------------------------------------
INSERT INTO products
  (name, description, price, image_url, category_id, badge_text, badge_type, sort_order)
VALUES
-- Globos (categoria_id = 1)
('Pack Globos Metálicos x12',
 'Pack de 12 globos metálicos surtidos en colores vivos. Ideales para cualquier celebración.',
 3500.00,
 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
 1, 'Más Vendido', 'popular', 1),

('Globo Gigante Número 5 Dorado',
 'Globo foil de 90 cm con número personalizado. Color dorado brillante.',
 4800.00,
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
 1, 'Nuevo', 'new', 2),

('Globos de Látex Pastel x20',
 'Pack de 20 globos de látex en tonos pasteles. Perfectos para baby shower o cumpleaños.',
 2200.00,
 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80',
 1, NULL, NULL, 3),

('Globo Transparente con Confeti',
 'Elegante globo transparente relleno de confeti de colores. Diámetro 45 cm.',
 5500.00,
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
 1, 'Oferta', 'sale', 4),

-- Piñatas (categoria_id = 2)
('Piñata Estrella Clásica',
 'Piñata tradicional de estrella de 7 picos con papel de china multicolor. 45 cm.',
 12000.00,
 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
 2, 'Más Vendido', 'popular', 1),

('Piñata Personalizada Temática',
 'Piñata artesanal con diseño personalizado según el tema de tu fiesta. Cotizar diseño.',
 18500.00,
 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
 2, 'Personalizable', 'custom', 2),

('Piñata Caja Sorpresa Pull',
 'Piñata tipo caja con cintas para jalar. No hace fuerza, apta para niños pequeños.',
 9800.00,
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
 2, 'Nuevo', 'new', 3),

-- Decoración General (categoria_id = 3)
('Kit Decoración Cumpleaños Completo',
 'Kit completo: globos, guirnaldas, confeti, serpentinas y tablero "Feliz Cumpleaños".',
 25000.00,
 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80',
 3, 'Kit Especial', 'special', 1),

('Cortina de Flecos Metálica',
 'Cortina decorativa de flecos metálicos. 1m x 2m. Disponible en dorado, plateado y rose gold.',
 6500.00,
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
 3, NULL, NULL, 2),

('Arco de Globos DIY Kit',
 'Kit para armar tu arco de globos: 120 globos, tira de arco, bomba infladora incluida.',
 15000.00,
 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
 3, 'Más Vendido', 'popular', 3),

('Serpentinas Holográficas x50',
 'Pack 50 serpentinas holográficas de 4 metros cada una. Efecto arcoíris brillante.',
 3200.00,
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
 3, 'Oferta', 'sale', 4),

-- Centros de Mesa (categoria_id = 4)
('Centro de Mesa Globo Helio',
 'Elegante centro de mesa con globo inflado en helio sobre base decorativa. Por unidad.',
 8500.00,
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
 4, NULL, NULL, 1),

('Centro de Mesa Floral Artificial',
 'Centro de mesa con flores artificiales de seda en jarrón decorado. Reutilizable.',
 11000.00,
 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80',
 4, 'Premium', 'special', 2),

('Centro de Mesa Candybar',
 'Base giratoria decorada para candy bar con detalles dorados. Altura 35 cm.',
 7800.00,
 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80',
 4, 'Nuevo', 'new', 3),

-- Pancartas & Banderines (categoria_id = 5)
('Pancarta "Feliz Cumpleaños" Dorada',
 'Pancarta de letras doradas brillantes sobre hilo. Letras de 15 cm. Largo total: 2m.',
 4200.00,
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
 5, 'Más Vendido', 'popular', 1),

('Guirnalda Triangular Multicolor',
 'Guirnalda de banderines triangulares de tela. 5 metros. Lavable y reutilizable.',
 3000.00,
 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
 5, NULL, NULL, 2),

('Banner Personalizado Impreso',
 'Banner fotográfico personalizado impreso en alta calidad. 1.5m x 0.8m. Envío incluido.',
 16000.00,
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
 5, 'Personalizable', 'custom', 3),

-- Cotillón (categoria_id = 6)
('Kit Cotillón Fiestera x10',
 'Set para 10 personas: sombrero, matasuegras, nariz, antifaz y confeti. Ideal fiestas.',
 7500.00,
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
 6, 'Más Vendido', 'popular', 1),

('Sombreros de Fiesta x6',
 'Pack 6 sombreros cónicos decorados con brillantes y borlas. Colores surtidos.',
 3800.00,
 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80',
 6, NULL, NULL, 2),

('Confeti Metálico Mixto 100g',
 '100g de confeti metálico en formas de estrellas, corazones y círculos. Múltiples colores.',
 2500.00,
 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80',
 6, 'Oferta', 'sale', 3),

-- Papelería de Fiesta (categoria_id = 7)
('Set Platos y Vasos x12',
 'Set de 12 platos y 12 vasos desechables decorados. Varios temas disponibles.',
 5200.00,
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
 7, NULL, NULL, 1),

('Servilletas Decoradas x20',
 'Pack 20 servilletas de papel decoradas con motivos festivos. Varios diseños.',
 1800.00,
 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
 7, NULL, NULL, 2),

('Bolsas de Regalo x10',
 'Pack 10 bolsas de regalo decoradas con papel tissue incluido. Varios tamaños.',
 4500.00,
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
 7, 'Nuevo', 'new', 3),

-- Temáticas Infantiles (categoria_id = 8)
('Kit Decoración Princesas',
 'Kit temático de princesas: globos, corona, varita, guirnaldas y centros de mesa.',
 22000.00,
 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80',
 8, 'Más Vendido', 'popular', 1),

('Kit Decoración Dinosaurios',
 'Temática dinosaurios: globos verdes, pancarta, platos, vasos y centros de mesa.',
 20000.00,
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
 8, 'Nuevo', 'new', 2),

('Kit Decoración Unicornio',
 'Temática unicornio con colores pastel: globos, guirnaldas, corona y photobooth props.',
 23500.00,
 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80',
 8, 'Más Vendido', 'popular', 3),

-- Quinceañera & XV (categoria_id = 9)
('Kit Quinceañera Rose Gold',
 'Kit premium rose gold: globos metálicos, arco, centros de mesa, tiaras y pancarta "XV".',
 45000.00,
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
 9, 'Premium', 'special', 1),

('Tiara y Corona Quinceañera',
 'Tiara decorativa con cristales y perlas. Incluye banda personalizable "XV Años".',
 12500.00,
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
 9, NULL, NULL, 2),

('Número "15" Foil Dorado Grande',
 'Globos foil "1" y "5" color dorado de 90 cm cada uno. Incluye hilo y base.',
 8500.00,
 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
 9, 'Nuevo', 'new', 3),

-- Bodas & Eventos (categoria_id = 10)
('Kit Decoración Boda Elegante',
 'Kit premium boda: arco floral, centros de mesa, globos blancos y dorados, y guirnaldas.',
 65000.00,
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
 10, 'Premium', 'special', 1),

('Letras Marquesina "AMOR"',
 'Letras marquesina con luces LED. Cada letra 40 cm. Set "AMOR". Luz cálida.',
 28000.00,
 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80',
 10, 'Más Vendido', 'popular', 2),

('Candelabros Decorativos x2',
 'Par de candelabros dorados de 60 cm. Reutilizables. Incluye velas decorativas.',
 18000.00,
 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80',
 10, NULL, NULL, 3);

-- -------------------------------------------------------------
-- 8. INSERT CONFIGURATION
-- -------------------------------------------------------------
INSERT INTO configuration (setting_key, value, description) VALUES
  ('tienda_nombre',       'Piñatería ML',                        'Nombre visible en la web y el admin'),
  ('tienda_subtitulo',    'Decoraciones & Cotillón',             'Subtítulo del navbar'),
  ('tienda_telefono',     '+54 9 11 0000-0000',                  'Teléfono de contacto'),
  ('tienda_whatsapp',     '5491100000000',                       'Número WhatsApp sin + ni espacios'),
  ('tienda_instagram',    '@pinateriaml',                        'Usuario de Instagram'),
  ('tienda_direccion',    'Buenos Aires, Argentina',             'Dirección o zona de cobertura'),
  ('tienda_horario',      'Lun–Sáb 9:00–20:00',                 'Horario de atención'),
  ('productos_por_pagina','12',                                  'Cantidad de productos por página en la web'),
  ('moneda_simbolo',      '$',                                   'Símbolo de moneda a mostrar');

-- =============================================================
-- USEFUL VIEWS
-- =============================================================

-- Returns all active products joined with their category data
-- (useful for API queries and the frontend)
CREATE OR REPLACE VIEW v_active_products AS
SELECT
  p.id,
  p.name,
  p.description,
  p.price,
  p.image_url,
  p.badge_text,
  p.badge_type,
  p.stock_available,
  p.sort_order,
  c.id         AS category_id,
  c.slug       AS category_slug,
  c.name       AS category_name,
  c.icon       AS category_icon
FROM products   p
JOIN categories c ON c.id = p.category_id
WHERE p.active = 1
  AND c.active = 1
ORDER BY c.sort_order, p.sort_order, p.id;

-- =============================================================
-- ADDITIONAL PERFORMANCE INDEXES
-- =============================================================
ALTER TABLE products
  ADD KEY idx_products_active_cat (active, category_id),
  ADD KEY idx_products_sort       (sort_order);

ALTER TABLE categories
  ADD KEY idx_categories_sort     (sort_order);

-- =============================================================
-- END OF SCRIPT
-- =============================================================

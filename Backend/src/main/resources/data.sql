-- Ensure IDs are generated for SQL seed inserts.
CREATE SEQUENCE IF NOT EXISTS hibernate_sequence START 1 INCREMENT 1;
ALTER TABLE shop ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');
ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');
ALTER TABLE employee ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');
ALTER TABLE service ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');
ALTER TABLE appointment ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');
ALTER TABLE review ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Dummy seed data for local development.
-- Statements are idempotent and only insert if records do not exist yet.

INSERT INTO shop (
    name, owner, address, address_longitude, address_latitude, email, phone_number, website,
    opening_time, closing_time, recommended, approved, price_category
)
SELECT
    'OpenBarber Downtown', 'Ali Demir', 'Königstraße 1, Stuttgart', 9.1783, 48.7758, 'downtown@openbarber.dev', '+49 711 123456',
    'https://openbarber.example/downtown', '09:00', '19:00', true, true, 2
WHERE NOT EXISTS (
    SELECT 1 FROM shop e WHERE e.email = 'downtown@openbarber.dev'
);

INSERT INTO shop (
    name, owner, address, address_longitude, address_latitude, email, phone_number, website,
    opening_time, closing_time, recommended, approved, price_category
)
SELECT
    'OpenBarber West', 'Mehmet Kaya', 'Rotebühlstraße 22, Stuttgart', 9.1643, 48.7787, 'west@openbarber.dev', '+49 711 987654',
    'https://openbarber.example/west', '10:00', '20:00', false, true, 1
WHERE NOT EXISTS (
    SELECT 1 FROM shop e WHERE e.email = 'west@openbarber.dev'
);

-- Opening days
INSERT INTO shop_opening_days (shop_id, opening_days)
SELECT e.id, day
FROM shop e
CROSS JOIN (VALUES ('MONDAY'), ('TUESDAY'), ('WEDNESDAY'), ('THURSDAY'), ('FRIDAY'), ('SATURDAY')) AS days(day)
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM shop_opening_days od WHERE od.shop_id = e.id
);

INSERT INTO shop_opening_days (shop_id, opening_days)
SELECT e.id, day
FROM shop e
CROSS JOIN (VALUES ('TUESDAY'), ('WEDNESDAY'), ('THURSDAY'), ('FRIDAY'), ('SATURDAY'), ('SUNDAY')) AS days(day)
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM shop_opening_days od WHERE od.shop_id = e.id
);

INSERT INTO shop_payment_methods (shop_id, payment_methods)
SELECT e.id, 'ON_SITE_CASH'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM shop_payment_methods epm
    WHERE epm.shop_id = e.id AND epm.payment_methods = 'ON_SITE_CASH'
);

INSERT INTO shop_payment_methods (shop_id, payment_methods)
SELECT e.id, 'ON_SITE_CARD'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM shop_payment_methods epm
    WHERE epm.shop_id = e.id AND epm.payment_methods = 'ON_SITE_CARD'
);

INSERT INTO shop_payment_methods (shop_id, payment_methods)
SELECT e.id, 'PAYPAL'
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM shop_payment_methods epm
    WHERE epm.shop_id = e.id AND epm.payment_methods = 'PAYPAL'
);

INSERT INTO shop_drinks (shop_id, drinks)
SELECT e.id, 'WATER'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM shop_drinks ed WHERE ed.shop_id = e.id AND ed.drinks = 'WATER'
);

INSERT INTO shop_drinks (shop_id, drinks)
SELECT e.id, 'COFFEE'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM shop_drinks ed WHERE ed.shop_id = e.id AND ed.drinks = 'COFFEE'
);

INSERT INTO shop_drinks (shop_id, drinks)
SELECT e.id, 'TEA'
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM shop_drinks ed WHERE ed.shop_id = e.id AND ed.drinks = 'TEA'
);

-- Password for all seed users: OpenBarber123!
INSERT INTO users (email, password, confirmation_code, confirmation_code_expiry, verification_attempts, name, first_name, last_name, created_at, shop_id, role)
SELECT
    'owner.downtown@openbarber.dev',
    '$2b$10$FrxP.kQ6pd7TVusm.CPQ6.f47lhdfViPRgDOCZlmHIUUNCoTYA4Ly',
    NULL, NULL, 0,
    'Ali Demir', 'Ali', 'Demir',
    NOW(),
    e.id,
    'OPERATOR'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'owner.downtown@openbarber.dev'
);

INSERT INTO users (email, password, confirmation_code, confirmation_code_expiry, verification_attempts, name, first_name, last_name, created_at, shop_id, role)
SELECT
    'owner.west@openbarber.dev',
    '$2b$10$FrxP.kQ6pd7TVusm.CPQ6.f47lhdfViPRgDOCZlmHIUUNCoTYA4Ly',
    NULL, NULL, 0,
    'Mehmet Kaya', 'Mehmet', 'Kaya',
    NOW(),
    e.id,
    'OPERATOR'
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'owner.west@openbarber.dev'
);

INSERT INTO users (email, password, confirmation_code, confirmation_code_expiry, verification_attempts, name, first_name, last_name, phone_number, created_at, role)
SELECT
    'customer1@openbarber.dev',
    '$2b$10$FrxP.kQ6pd7TVusm.CPQ6.f47lhdfViPRgDOCZlmHIUUNCoTYA4Ly',
    NULL, NULL, 0,
    'Max Mustermann', 'Max', 'Mustermann', '+49 176 000111',
    NOW(),
    'VERIFIED'
WHERE NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'customer1@openbarber.dev'
);

INSERT INTO users (email, password, confirmation_code, confirmation_code_expiry, verification_attempts, name, first_name, last_name, phone_number, created_at, role)
SELECT
    'customer2@openbarber.dev',
    '$2b$10$FrxP.kQ6pd7TVusm.CPQ6.f47lhdfViPRgDOCZlmHIUUNCoTYA4Ly',
    NULL, NULL, 0,
    'Erika Musterfrau', 'Erika', 'Musterfrau', '+49 176 000222',
    NOW(),
    'VERIFIED'
WHERE NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'customer2@openbarber.dev'
);

INSERT INTO employee (name, title, shop_id)
SELECT 'Samir', 'Senior Barber', e.id
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM employee emp WHERE emp.name = 'Samir' AND emp.shop_id = e.id
);

INSERT INTO employee (name, title, shop_id)
SELECT 'Luca', 'Barber', e.id
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM employee emp WHERE emp.name = 'Luca' AND emp.shop_id = e.id
);

INSERT INTO employee (name, title, shop_id)
SELECT 'Deniz', 'Stylist', e.id
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM employee emp WHERE emp.name = 'Deniz' AND emp.shop_id = e.id
);

-- target_audience uses enum ordinal: ALL=0, MEN=1, WOMEN=2, CHILDREN=3
INSERT INTO service (price, title, duration_in_min, target_audience, shop_id)
SELECT 28.0, 'Classic Cut', 30, 1, e.id
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM service s WHERE s.title = 'Classic Cut' AND s.shop_id = e.id
);

INSERT INTO service (price, title, duration_in_min, target_audience, shop_id)
SELECT 18.0, 'Beard Trim', 20, 1, e.id
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM service s WHERE s.title = 'Beard Trim' AND s.shop_id = e.id
);

INSERT INTO service (price, title, duration_in_min, target_audience, shop_id)
SELECT 45.0, 'Color & Style', 60, 0, e.id
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM service s WHERE s.title = 'Color & Style' AND s.shop_id = e.id
);

INSERT INTO appointment (
    reviewed, customer_name, customer_phone_number, customer_email, appointment_date_time,
    confirmed, confirmation_code, shop_id, employee_id, customer_id
)
SELECT
    false, 'Max Mustermann', '+49 176 000111', 'customer1@openbarber.dev',
    NOW() + INTERVAL '2 day', true, '11111111-1111-1111-1111-111111111111', e.id, emp.id, u.id
FROM shop e
JOIN employee emp ON emp.shop_id = e.id AND emp.name = 'Samir'
JOIN users u ON u.email = 'customer1@openbarber.dev'
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM appointment a
    WHERE a.confirmation_code = '11111111-1111-1111-1111-111111111111'::uuid
);

INSERT INTO appointment (
    reviewed, customer_name, customer_phone_number, customer_email, appointment_date_time,
    confirmed, confirmation_code, shop_id, employee_id, customer_id
)
SELECT
    false, 'Erika Musterfrau', '+49 176 000222', 'customer2@openbarber.dev',
    NOW() + INTERVAL '4 day', false, '22222222-2222-2222-2222-222222222222', e.id, emp.id, u.id
FROM shop e
JOIN employee emp ON emp.shop_id = e.id AND emp.name = 'Deniz'
JOIN users u ON u.email = 'customer2@openbarber.dev'
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM appointment a
    WHERE a.confirmation_code = '22222222-2222-2222-2222-222222222222'::uuid
);

INSERT INTO appointment_payment_methods (appointment_id, payment_methods)
SELECT a.id, 'ON_SITE_CARD'
FROM appointment a
WHERE a.confirmation_code = '11111111-1111-1111-1111-111111111111'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM appointment_payment_methods apm
    WHERE apm.appointment_id = a.id AND apm.payment_methods = 'ON_SITE_CARD'
);

INSERT INTO appointment_payment_methods (appointment_id, payment_methods)
SELECT a.id, 'PAYPAL'
FROM appointment a
WHERE a.confirmation_code = '22222222-2222-2222-2222-222222222222'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM appointment_payment_methods apm
    WHERE apm.appointment_id = a.id AND apm.payment_methods = 'PAYPAL'
);

INSERT INTO appointment_service (appointment_id, service_id)
SELECT a.id, s.id
FROM appointment a
JOIN service s ON s.title = 'Classic Cut'
WHERE a.confirmation_code = '11111111-1111-1111-1111-111111111111'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM appointment_service asv
    WHERE asv.appointment_id = a.id AND asv.service_id = s.id
);

INSERT INTO appointment_service (appointment_id, service_id)
SELECT a.id, s.id
FROM appointment a
JOIN service s ON s.title = 'Color & Style'
WHERE a.confirmation_code = '22222222-2222-2222-2222-222222222222'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM appointment_service asv
    WHERE asv.appointment_id = a.id AND asv.service_id = s.id
);

-- Reviews linked to customer users (reviewer_id)
INSERT INTO review (author, comment, rating, created_at, shop_id, reviewer_id)
SELECT u.name, 'Sehr sauberer Laden und top Service.', 5.0, NOW(), e.id, u.id
FROM shop e
JOIN users u ON u.email = 'customer1@openbarber.dev'
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM review r WHERE r.shop_id = e.id AND r.reviewer_id = u.id
  );

INSERT INTO review (author, comment, rating, created_at, shop_id, reviewer_id)
SELECT u.name, 'Freundliches Team, komme gerne wieder.', 4.5, NOW(), e.id, u.id
FROM shop e
JOIN users u ON u.email = 'customer2@openbarber.dev'
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM review r WHERE r.shop_id = e.id AND r.reviewer_id = u.id
  );


-- Dummy seed data for local development.
-- Statements are idempotent and only insert if records do not exist yet.

INSERT INTO shop (
    name, owner, address, address_longitude, address_latitude, email, phone_number, website,
    opening_time, closing_time, recommended, approved, price_category
)
SELECT
    'OpenBarber Downtown', 'Ali Demir', 'Königstraße 1, Stuttgart', 9.1783, 48.7758, 'downtown@openbarber.dev', '+49 711 123456',
    'https://openbarber.example/downtown', '09:00', '19:00', true, true, 2
WHERE NOT EXISTS (
    SELECT 1 FROM shop e WHERE e.email = 'downtown@openbarber.dev'
);

INSERT INTO shop (
    name, owner, address, address_longitude, address_latitude, email, phone_number, website,
    opening_time, closing_time, recommended, approved, price_category
)
SELECT
    'OpenBarber West', 'Mehmet Kaya', 'Rotebühlstraße 22, Stuttgart', 9.1643, 48.7787, 'west@openbarber.dev', '+49 711 987654',
    'https://openbarber.example/west', '10:00', '20:00', false, true, 1
WHERE NOT EXISTS (
    SELECT 1 FROM shop e WHERE e.email = 'west@openbarber.dev'
);

INSERT INTO shop_payment_methods (shop_id, payment_methods)
SELECT e.id, 'ON_SITE_CASH'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM shop_payment_methods epm
    WHERE epm.shop_id = e.id AND epm.payment_methods = 'ON_SITE_CASH'
);

INSERT INTO shop_payment_methods (shop_id, payment_methods)
SELECT e.id, 'ON_SITE_CARD'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM shop_payment_methods epm
    WHERE epm.shop_id = e.id AND epm.payment_methods = 'ON_SITE_CARD'
);

INSERT INTO shop_payment_methods (shop_id, payment_methods)
SELECT e.id, 'PAYPAL'
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM shop_payment_methods epm
    WHERE epm.shop_id = e.id AND epm.payment_methods = 'PAYPAL'
);

INSERT INTO shop_drinks (shop_id, drinks)
SELECT e.id, 'WATER'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM shop_drinks ed WHERE ed.shop_id = e.id AND ed.drinks = 'WATER'
);

INSERT INTO shop_drinks (shop_id, drinks)
SELECT e.id, 'COFFEE'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM shop_drinks ed WHERE ed.shop_id = e.id AND ed.drinks = 'COFFEE'
);

INSERT INTO shop_drinks (shop_id, drinks)
SELECT e.id, 'TEA'
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM shop_drinks ed WHERE ed.shop_id = e.id AND ed.drinks = 'TEA'
);

-- Password for all seed users: OpenBarber123!
INSERT INTO users (email, password, confirmation_code, confirmation_code_expiry, verification_attempts, name, created_at, shop_id, role)
SELECT
    'owner.downtown@openbarber.dev',
    '$2b$10$FrxP.kQ6pd7TVusm.CPQ6.f47lhdfViPRgDOCZlmHIUUNCoTYA4Ly',
    NULL, NULL, 0,
    'Ali Demir',
    NOW(),
    e.id,
    'OPERATOR'
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'owner.downtown@openbarber.dev'
);

INSERT INTO users (email, password, confirmation_code, confirmation_code_expiry, verification_attempts, name, created_at, shop_id, role)
SELECT
    'owner.west@openbarber.dev',
    '$2b$10$FrxP.kQ6pd7TVusm.CPQ6.f47lhdfViPRgDOCZlmHIUUNCoTYA4Ly',
    NULL, NULL, 0,
    'Mehmet Kaya',
    NOW(),
    e.id,
    'OPERATOR'
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'owner.west@openbarber.dev'
);

INSERT INTO users (email, password, confirmation_code, confirmation_code_expiry, verification_attempts, name, created_at, role)
SELECT
    'customer1@openbarber.dev',
    '$2b$10$FrxP.kQ6pd7TVusm.CPQ6.f47lhdfViPRgDOCZlmHIUUNCoTYA4Ly',
    NULL, NULL, 0,
    'Max Mustermann',
    NOW(),
    'VERIFIED'
WHERE NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'customer1@openbarber.dev'
);

INSERT INTO users (email, password, confirmation_code, confirmation_code_expiry, verification_attempts, name, created_at, role)
SELECT
    'customer2@openbarber.dev',
    '$2b$10$FrxP.kQ6pd7TVusm.CPQ6.f47lhdfViPRgDOCZlmHIUUNCoTYA4Ly',
    NULL, NULL, 0,
    'Erika Musterfrau',
    NOW(),
    'VERIFIED'
WHERE NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = 'customer2@openbarber.dev'
);

INSERT INTO employee (name, title, shop_id)
SELECT 'Samir', 'Senior Barber', e.id
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM employee emp WHERE emp.name = 'Samir' AND emp.shop_id = e.id
);

INSERT INTO employee (name, title, shop_id)
SELECT 'Luca', 'Barber', e.id
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM employee emp WHERE emp.name = 'Luca' AND emp.shop_id = e.id
);

INSERT INTO employee (name, title, shop_id)
SELECT 'Deniz', 'Stylist', e.id
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM employee emp WHERE emp.name = 'Deniz' AND emp.shop_id = e.id
);

-- target_audience uses enum ordinal: ALL=0, MEN=1, WOMEN=2, CHILDREN=3
INSERT INTO service (price, title, duration_in_min, target_audience, shop_id)
SELECT 28.0, 'Classic Cut', 30, 1, e.id
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM service s WHERE s.title = 'Classic Cut' AND s.shop_id = e.id
);

INSERT INTO service (price, title, duration_in_min, target_audience, shop_id)
SELECT 18.0, 'Beard Trim', 20, 1, e.id
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM service s WHERE s.title = 'Beard Trim' AND s.shop_id = e.id
);

INSERT INTO service (price, title, duration_in_min, target_audience, shop_id)
SELECT 45.0, 'Color & Style', 60, 0, e.id
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1 FROM service s WHERE s.title = 'Color & Style' AND s.shop_id = e.id
);

INSERT INTO appointment (
    reviewed, customer_name, customer_phone_number, customer_email, appointment_date_time,
    confirmed, confirmation_code, shop_id, employee_id
)
SELECT
    false, 'Max Mustermann', '+49 176 000111', 'customer1@openbarber.dev',
    NOW() + INTERVAL '2 day', true, '11111111-1111-1111-1111-111111111111', e.id, emp.id
FROM shop e
JOIN employee emp ON emp.shop_id = e.id AND emp.name = 'Samir'
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM appointment a
    WHERE a.confirmation_code = '11111111-1111-1111-1111-111111111111'::uuid
);

INSERT INTO appointment (
    reviewed, customer_name, customer_phone_number, customer_email, appointment_date_time,
    confirmed, confirmation_code, shop_id, employee_id
)
SELECT
    false, 'Erika Musterfrau', '+49 176 000222', 'customer2@openbarber.dev',
    NOW() + INTERVAL '4 day', false, '22222222-2222-2222-2222-222222222222', e.id, emp.id
FROM shop e
JOIN employee emp ON emp.shop_id = e.id AND emp.name = 'Deniz'
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM appointment a
    WHERE a.confirmation_code = '22222222-2222-2222-2222-222222222222'::uuid
);

INSERT INTO appointment_payment_methods (appointment_id, payment_methods)
SELECT a.id, 'ON_SITE_CARD'
FROM appointment a
WHERE a.confirmation_code = '11111111-1111-1111-1111-111111111111'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM appointment_payment_methods apm
    WHERE apm.appointment_id = a.id AND apm.payment_methods = 'ON_SITE_CARD'
);

INSERT INTO appointment_payment_methods (appointment_id, payment_methods)
SELECT a.id, 'PAYPAL'
FROM appointment a
WHERE a.confirmation_code = '22222222-2222-2222-2222-222222222222'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM appointment_payment_methods apm
    WHERE apm.appointment_id = a.id AND apm.payment_methods = 'PAYPAL'
);

INSERT INTO appointment_service (appointment_id, service_id)
SELECT a.id, s.id
FROM appointment a
JOIN service s ON s.title = 'Classic Cut'
WHERE a.confirmation_code = '11111111-1111-1111-1111-111111111111'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM appointment_service asv
    WHERE asv.appointment_id = a.id AND asv.service_id = s.id
);

INSERT INTO appointment_service (appointment_id, service_id)
SELECT a.id, s.id
FROM appointment a
JOIN service s ON s.title = 'Color & Style'
WHERE a.confirmation_code = '22222222-2222-2222-2222-222222222222'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM appointment_service asv
    WHERE asv.appointment_id = a.id AND asv.service_id = s.id
);

INSERT INTO review (author, comment, rating, created_at, shop_id)
SELECT 'Max Mustermann', 'Sehr sauberer Laden und top Service.', 5.0, NOW(), e.id
FROM shop e
WHERE e.email = 'downtown@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM review r
    WHERE r.shop_id = e.id AND r.author = 'Max Mustermann'
  );

INSERT INTO review (author, comment, rating, created_at, shop_id)
SELECT 'Erika Musterfrau', 'Freundliches Team, komme gerne wieder.', 4.5, NOW(), e.id
FROM shop e
WHERE e.email = 'west@openbarber.dev'
  AND NOT EXISTS (
    SELECT 1
    FROM review r
    WHERE r.shop_id = e.id AND r.author = 'Erika Musterfrau'
  );

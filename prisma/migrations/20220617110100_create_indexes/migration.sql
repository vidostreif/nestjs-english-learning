-- Удаление всех констант которые не являются первичными и вторичными ключами
DO $$DECLARE r record;
    BEGIN
        FOR r IN SELECT table_name,constraint_name
                FROM information_schema.constraint_table_usage
                WHERE table_name IN ('dictionaries', 'userRoles', 'users')
				        AND constraint_name NOT LIKE '%' || 'fkey' || '%'
				        AND constraint_name NOT LIKE '%' || 'pkey' || '%'
        LOOP
            EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name)|| ' DROP CONSTRAINT '|| quote_ident(r.constraint_name) || ';';
        END LOOP;
    END$$;

-- CreateIndex
CREATE UNIQUE INDEX "dictionaries_name_key" ON "dictionaries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "userRoles_name_key" ON "userRoles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

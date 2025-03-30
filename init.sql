-- Tabela users (com verificação de existência)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela clients (com verificação de existência)
CREATE TABLE IF NOT EXISTS clients (
    client_id SERIAL PRIMARY KEY,
    client_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    document VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela rooms (com verificação de existência)
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    number_room VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type_room VARCHAR(20) NOT NULL CHECK (type_room IN ('Single room', 'Double room', 'Triple room', 'Quadruple room')),
    category_room VARCHAR(20) NOT NULL CHECK (category_room IN ('Main house', 'Garden', 'Tower 1', 'Tower 2')),
    beds INT NOT NULL,
    size VARCHAR(20) NOT NULL,
    options TEXT[],
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Primeiro cria a tabela reservations sem a constraint que depende de companions
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(client_id),
    number_room VARCHAR(10) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_guests INT NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agora cria a tabela companions que depende de reservations
CREATE TABLE IF NOT EXISTS companions (
    companion_id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    reservation_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    document VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    CONSTRAINT unique_companion_document UNIQUE (reservation_id, document)
);

-- Agora adiciona as constraints que dependem de outras tabelas
ALTER TABLE reservations
ADD CONSTRAINT valid_guest_count CHECK (
    total_guests <= (SELECT beds FROM rooms WHERE number_room = reservations.number_room)
);

ALTER TABLE reservations
ADD CONSTRAINT fk_room_number FOREIGN KEY (number_room) REFERENCES rooms(number_room);

-- Criação da função e trigger
CREATE OR REPLACE FUNCTION delete_companions_after_checkout()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status <> 'checked_out' AND NEW.status = 'checked_out' THEN
        DELETE FROM companions WHERE reservation_id = NEW.reservation_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para monitorar mudanças de status
CREATE TRIGGER trg_delete_companions
AFTER UPDATE ON reservations
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION delete_companions_after_checkout();

-- Criação dos índices
CREATE INDEX IF NOT EXISTS idx_companions_client_id ON companions(client_id);
CREATE INDEX IF NOT EXISTS idx_companions_reservation_id ON companions(reservation_id);
CREATE INDEX IF NOT EXISTS idx_reservations_client_id ON reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_reservations_number_room ON reservations(number_room); 
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_document ON clients(document);
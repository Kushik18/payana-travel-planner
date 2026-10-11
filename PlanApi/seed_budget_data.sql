-- Seed Data for Smart Budget Intelligence Engine

-- Destinations
INSERT INTO budget_destination (name, district, state, tourism_type) VALUES ('Mysuru', 'Mysuru', 'Karnataka', 'Heritage');
INSERT INTO budget_destination (name, district, state, tourism_type) VALUES ('Coorg', 'Kodagu', 'Karnataka', 'Nature');
INSERT INTO budget_destination (name, district, state, tourism_type) VALUES ('Hampi', 'Vijayanagara', 'Karnataka', 'Heritage');

-- Hotel Pricing (Dest 1: Mysuru)
INSERT INTO budget_hotel_pricing (destination_id, budget_level, price_per_night, rating, season) VALUES (1, 'low', 900, 3.5, 'Normal');
INSERT INTO budget_hotel_pricing (destination_id, budget_level, price_per_night, rating, season) VALUES (1, 'mid-range', 2400, 4.2, 'Normal');
INSERT INTO budget_hotel_pricing (destination_id, budget_level, price_per_night, rating, season) VALUES (1, 'luxury', 8500, 4.8, 'Normal');
INSERT INTO budget_hotel_pricing (destination_id, budget_level, price_per_night, rating, season) VALUES (1, 'mid-range', 3000, 4.2, 'Peak');

-- Hotel Pricing (Dest 2: Coorg)
INSERT INTO budget_hotel_pricing (destination_id, budget_level, price_per_night, rating, season) VALUES (2, 'low', 1200, 3.5, 'Normal');
INSERT INTO budget_hotel_pricing (destination_id, budget_level, price_per_night, rating, season) VALUES (2, 'mid-range', 3500, 4.5, 'Normal');
INSERT INTO budget_hotel_pricing (destination_id, budget_level, price_per_night, rating, season) VALUES (2, 'luxury', 12000, 4.9, 'Normal');
INSERT INTO budget_hotel_pricing (destination_id, budget_level, price_per_night, rating, season) VALUES (2, 'mid-range', 5000, 4.5, 'Peak');

-- Food Pricing
INSERT INTO budget_food_pricing (destination_id, budget_level, price_per_person_day) VALUES (1, 'low', 350);
INSERT INTO budget_food_pricing (destination_id, budget_level, price_per_person_day) VALUES (1, 'mid-range', 650);
INSERT INTO budget_food_pricing (destination_id, budget_level, price_per_person_day) VALUES (1, 'luxury', 1800);
INSERT INTO budget_food_pricing (destination_id, budget_level, price_per_person_day) VALUES (2, 'low', 450);
INSERT INTO budget_food_pricing (destination_id, budget_level, price_per_person_day) VALUES (2, 'mid-range', 850);
INSERT INTO budget_food_pricing (destination_id, budget_level, price_per_person_day) VALUES (2, 'luxury', 2200);

-- Transport Pricing (Bangalore to destinations)
INSERT INTO budget_transport_pricing (source, destination, mode, price, distance, duration_mins) VALUES ('Bangalore', 'Mysuru', 'KSRTC Bus', 180, 150, 180);
INSERT INTO budget_transport_pricing (source, destination, mode, price, distance, duration_mins) VALUES ('Bangalore', 'Mysuru', 'Train', 120, 140, 150);
INSERT INTO budget_transport_pricing (source, destination, mode, price, distance, duration_mins) VALUES ('Bangalore', 'Mysuru', 'Taxi', 2500, 150, 180);

-- Attractions
INSERT INTO budget_attraction (destination_id, name, entry_fee, duration_mins) VALUES (1, 'Mysore Palace', 100, 120);
INSERT INTO budget_attraction (destination_id, name, entry_fee, duration_mins) VALUES (1, 'Mysore Zoo', 200, 180);
INSERT INTO budget_attraction (destination_id, name, entry_fee, duration_mins) VALUES (1, 'Rail Museum', 50, 60);
INSERT INTO budget_attraction (destination_id, name, entry_fee, duration_mins) VALUES (2, 'Abbey Falls', 50, 60);
INSERT INTO budget_attraction (destination_id, name, entry_fee, duration_mins) VALUES (2, 'Raja Seat', 30, 45);

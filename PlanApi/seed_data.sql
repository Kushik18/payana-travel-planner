-- ================================================================
-- Karnataka Festival Seed Data
-- Run this in your trip_plan database via phpMyAdmin or MySQL CLI
-- ================================================================

INSERT IGNORE INTO festivals (name, district, start_date, end_date, description) VALUES
('Mysuru Dasara',        'Mysuru',      '2026-10-02', '2026-10-12', 'The grand 10-day royal festival of Mysuru, featuring a spectacular illuminated procession (Jamboo Savari), cultural performances, and the famous Chamundi Hills pilgrimage. Millions attend this UNESCO-recognized celebration.'),
('Hampi Utsav',         'Vijayanagara', '2026-11-03', '2026-11-05', 'A 3-day cultural extravaganza at the ruins of the Vijayanagara Empire. Features classical dance, music, light-and-sound shows at Hampi, and folk performances against the stunning boulder-strewn landscape.'),
('Kambala',             'Dakshina Kannada', '2026-11-15', '2027-02-28', 'The traditional buffalo-racing festival of coastal Karnataka (Tulu Nadu), held across dozens of villages from November to March. An ancient sport that showcases coastal culture and heritage.'),
('Ugadi',               'All Districts', '2026-03-19', '2026-03-19', 'Karnataka New Year — celebrated across the state with a special dish called Ugadi Pachadi (a mix of 6 tastes), temple visits, new clothes, and family gatherings. One of the most important festivals for Kannadigas.'),
('Makar Sankranti',     'All Districts', '2026-01-14', '2026-01-16', 'The harvest festival celebrated with sesame sweets (Ellu-bella), flying kites, and cow decorations. Especially vibrant in rural Karnataka with bonfire traditions.'),
('Gowri-Ganesh Festival','All Districts', '2026-08-27', '2026-08-28', 'A two-day celebration where Goddess Gowri is welcomed followed by Ganesh Chaturthi. Homes are decorated with mango-leaf torans, rangoli, and traditional lamps.'),
('Bangalore Karaga',    'Bengaluru',    '2026-04-10', '2026-04-10', 'One of the oldest urban festivals in Bengaluru, celebrated by the Tigala community in the heart of the city. The Karaga procession through the old city streets is a breathtaking spectacle.'),
('Paryaya Festival',    'Udupi',        '2026-01-18', '2026-01-18', 'Held every two years at the Udupi Sri Krishna temple, marking the transfer of administration between the eight mutts. A massive religious event drawing lakhs of devotees to coastal Karnataka.'),
('Coorg Puttari',       'Kodagu',       '2026-11-20', '2026-11-22', 'The harvest festival of the Kodava people of Coorg — celebrating the new rice crop with traditional Kodava folk dances, music, and the lighting of the Kaimada lamp in every home.'),
('Yellamma Jatre',      'Savanur',      '2026-02-12', '2026-02-14', 'A vibrant folk fair in northern Karnataka honoring Goddess Renuka-Yellamma with thousands of devotees, traditional tribal music, and a colorful procession.')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ================================================================
-- Karnataka Hidden Gems Seed Data
-- ================================================================

INSERT IGNORE INTO hidden_gems (place_name, district, latitude, longitude, category, description, rating) VALUES
('Devarayana Durga',    'Tumkur',           13.3741, 77.1699, 'Heritage',   'A rocky hill fortress rising 1,501 meters above sea level with two ancient temples dedicated to Bhoga Narasimha and Yoga Narasimha. Stunning sunrise views and relatively unexplored by tourists.', 4.5),
('Mallalli Falls',      'Kodagu',           12.2177, 75.7278, 'Waterfall',  'A magnificent 60-meter waterfall on the Kumaradhara river deep inside Pushpagiri Wildlife Sanctuary. Requires a 4-km trek through dense rainforest — virtually untouched and pristine.', 4.8),
('Agumbe',              'Shivamogga',       13.5043, 75.0949, 'Nature',     'The "Cherrapunji of the South" — one of the wettest places in India and home to the King Cobra sanctuary. Famous for its spectacular sunsets and a research center for the King Cobra.', 4.7),
('Kodachadri',          'Shivamogga',       14.1827, 74.9855, 'Trek',       'A 1,343-meter peak offering breathtaking views of the Western Ghats and the Arabian Sea on a clear day. Surrounded by Mookambika wildlife sanctuary with rich biodiversity.', 4.6),
('Sogal Falls',         'Uttara Kannada',   14.8200, 74.5900, 'Waterfall',  'A hidden 25-meter waterfall surrounded by dense forest near Sirsi, accessible via a 2-km forest trail. Seldom visited, offering a peaceful and pristine experience.', 4.3),
('Anthargange',         'Kolar',            13.1700, 78.1900, 'Trek',       'Volcanic rock formations hiding a cave temple with underground passages. A unique geological wonder near Bengaluru with night treks available in summer.', 4.4),
('Yana Rocks',          'Uttara Kannada',   14.5400, 74.7100, 'Heritage',   'Massive 100-meter-tall black crystalline limestone rocks rising dramatically from the forest floor near Sirsi. Home to Bhairaveshwara Shakti Peetha temple inside a cave.', 4.7),
('Hogenakkal Falls',    'Chamarajanagar',   12.1049, 77.7894, 'Waterfall',  'Karnataka side of the Cauvery river falls — less crowded than the Tamil Nadu side. Famous for coracle boat rides through dramatic gorges and local fish curry.', 4.2),
('Sakleshpur',          'Hassan',           12.9455, 75.7858, 'Nature',     'A misty hill station known for coffee and cardamom plantations in the Western Ghats. Base for the famous Kukke Subramanya trek and less crowded than Coorg.', 4.5),
('Mullayanagiri',       'Chikmagalur',      13.3944, 75.7372, 'Trek',       'The highest peak in Karnataka at 1,930 meters. A well-marked trekking trail through the Baba Budangiri range with panoramic views of the Western Ghats on clear days.', 4.6),
('Bheemeshwari',        'Ramanagara',       12.5100, 77.2000, 'Adventure',  'A premier adventure camp on the banks of the Cauvery river. Known for Mahseer fishing (the Tiger of the River), kayaking, and nature walks in a rich biodiversity zone.', 4.4),
('Tadiyendamol',        'Kodagu',           11.9500, 75.8900, 'Trek',       'The highest peak in Coorg at 1,748 meters. A scenic 7-km trek through shola forests and grasslands, often with elephant sightings. One of Karnataka''s best kept trekking secrets.', 4.5)
ON DUPLICATE KEY UPDATE description = VALUES(description);

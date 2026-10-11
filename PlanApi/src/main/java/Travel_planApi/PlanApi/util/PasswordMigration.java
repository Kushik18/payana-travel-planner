// Password migration utility — hashes any plaintext passwords on startup
package Travel_planApi.PlanApi.util;

import Travel_planApi.PlanApi.Entity.Adminlogin;
import Travel_planApi.PlanApi.Entity.Registor;
import Travel_planApi.PlanApi.Entity.Itinerary;
import Travel_planApi.PlanApi.Repository.AdminLogrepo;
import Travel_planApi.PlanApi.Repository.RegisterInter;
import Travel_planApi.PlanApi.Repository.ItineraryRepo;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordMigration {

    private static final Logger logger = LoggerFactory.getLogger(PasswordMigration.class);

    @Autowired
    private RegisterInter registerRepo;

    @Autowired
    private AdminLogrepo adminRepo;

    @Autowired
    private ItineraryRepo itineraryRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void migratePasswords() {
        logger.info("=== PASSWORD MIGRATION STARTED ===");

        seedDefaultUsers();
        seedItineraries();
        migrateUserPasswords();
        migrateAdminPasswords();

        logger.info("=== PASSWORD MIGRATION COMPLETE ===");
    }

    private void seedDefaultUsers() {
        logger.info("--- Seeding default users ---");
        if (adminRepo.findByUsername("admin@gmail.com") == null) {
            Adminlogin admin = new Adminlogin();
            admin.setUsername("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setFullName("Administrator");
            adminRepo.save(admin);
            logger.info("Seeded default admin user: admin@gmail.com");
        }

        if (registerRepo.findByuseremail("tester_123@gmail.com").isEmpty()) {
            Registor user = new Registor();
            user.setUsername("tester");
            user.setUseremail("tester_123@gmail.com");
            user.setPassword(passwordEncoder.encode("password123"));
            registerRepo.save(user);
            logger.info("Seeded default user: tester_123@gmail.com");
        }
    }

    private void seedItineraries() {
        if (itineraryRepo.count() < 10) {
            logger.info("--- Seeding massive comprehensive itineraries ---");
            seedPlace("Bengaluru", "Lalbagh Botanical Garden", "relaxed", "family", "12.9507", "77.5848", "Historic botanical garden with a glasshouse and diverse plant species.");
            seedPlace("Bengaluru", "Cubbon Park", "relaxed", "family", "12.9779", "77.5952", "A major green lung space in the heart of the city.");
            seedPlace("Bengaluru", "Bangalore Palace", "cultural", "family", "12.9988", "77.5921", "Tudor-style royal palace with beautiful grounds and interiors.");
            seedPlace("Bengaluru", "Wonderla Amusement Park", "entertainment", "friends", "12.8343", "77.4010", "Large amusement park with thrilling rides and water slides.");
            seedPlace("Bengaluru", "Nandi Hills", "adventurous", "friends", "13.3702", "77.6835", "Popular hill fortress known for stunning sunrise views.");
            seedPlace("Mysuru", "Mysore Palace", "cultural", "family", "12.3051", "76.6551", "A historical palace and a royal residence.");
            seedPlace("Mysuru", "Chamundi Hill", "spiritual", "family", "12.2746", "76.6715", "Famous temple dedicated to Goddess Chamundeshwari.");
            seedPlace("Mysuru", "Brindavan Gardens", "romantic", "couple", "12.4243", "76.5732", "Terraced gardens known for their musical fountain show.");
            seedPlace("Mysuru", "Mysuru Zoo", "entertainment", "family", "12.3025", "76.6644", "One of the oldest and most popular zoos in India.");
            seedPlace("Kodagu", "Abbey Falls", "adventurous", "friends", "12.4468", "75.7171", "A beautiful waterfall surrounded by coffee plantations.");
            seedPlace("Kodagu", "Raja's Seat", "romantic", "couple", "12.4168", "75.7368", "A scenic viewpoint offering panoramic views of the valleys.");
            seedPlace("Kodagu", "Dubare Elephant Camp", "adventurous", "family", "12.3685", "75.9056", "Interact with elephants at this forest camp on the banks of Cauvery.");
            seedPlace("Kodagu", "Talakaveri", "spiritual", "family", "12.3842", "75.4842", "The source of the river Kaveri, located on Brahmagiri hill.");
            seedPlace("Chikmagalur", "Mullayanagiri Peak", "adventurous", "friends", "13.3944", "75.7372", "The highest peak in Karnataka, perfect for trekking.");
            seedPlace("Chikmagalur", "Baba Budangiri", "spiritual", "solo", "13.4182", "75.7629", "A mountain range famous for its shrine and scenic views.");
            seedPlace("Chikmagalur", "Hebbe Falls", "adventurous", "friends", "13.5463", "75.7226", "Magnificent waterfalls accessed via an exciting jeep ride.");
            seedPlace("Hassan", "Belur Chennakeshava Temple", "cultural", "family", "13.1627", "75.8601", "Hoysala architecture masterpiece with intricate stone carvings.");
            seedPlace("Hassan", "Halebidu Hoysaleshwara Temple", "cultural", "family", "13.2127", "75.9942", "Another spectacular example of Hoysala temple architecture.");
            seedPlace("Hassan", "Shravanabelagola", "spiritual", "family", "12.8550", "76.4862", "Famous Jain pilgrimage site with a giant Gommateshwara statue.");
            seedPlace("Vijayanagara", "Hampi Ruins", "cultural", "solo", "15.3350", "76.4600", "Ancient ruins of the Vijayanagara Empire, a UNESCO World Heritage site.");
            seedPlace("Vijayanagara", "Virupaksha Temple", "spiritual", "family", "15.3361", "76.4595", "One of the oldest functioning temples in India, located in Hampi.");
            seedPlace("Udupi", "Sri Krishna Temple", "spiritual", "family", "13.3411", "74.7461", "A highly revered Hindu temple dedicated to Lord Krishna.");
            seedPlace("Udupi", "Malpe Beach", "relaxed", "friends", "13.3551", "74.6974", "A popular beach destination offering water sports and boat rides to St. Mary's Island.");
            seedPlace("Udupi", "St. Mary's Island", "adventurous", "couple", "13.3797", "74.6743", "Known for its unique geological formation of columnar basaltic lava.");
            seedPlace("Dakshina Kannada", "Panambur Beach", "relaxed", "family", "12.9460", "74.8115", "A clean and safe beach known for its sunset views.");
            seedPlace("Dakshina Kannada", "Kudroli Gokarnath Temple", "spiritual", "family", "12.8837", "74.8340", "A vibrant temple in Mangalore, famous for its Dasara celebrations.");
            seedPlace("Dakshina Kannada", "Pilikula Nisargadhama", "entertainment", "family", "12.9329", "74.8964", "An eco-education and tourism park with a zoo, botanical garden, and boating.");
            seedPlace("Uttara Kannada", "Gokarna Om Beach", "relaxed", "friends", "14.5190", "74.3168", "Famous beach shaped like the spiritual symbol 'Om'.");
            seedPlace("Uttara Kannada", "Murudeshwara Temple", "spiritual", "family", "14.0940", "74.4849", "Home to the world's second tallest Shiva statue, situated right on the coast.");
            seedPlace("Uttara Kannada", "Jog Falls", "adventurous", "friends", "14.2285", "74.8122", "One of the highest plunge waterfalls in India, created by the Sharavathi River.");
            seedPlace("Uttara Kannada", "Dandeli Wildlife Sanctuary", "adventurous", "friends", "15.2443", "74.6231", "A haven for nature lovers, offering white water rafting and jungle safaris.");
            seedPlace("Shivamogga", "Agumbe", "adventurous", "solo", "13.5043", "75.0949", "Known as the Cherrapunji of the South, famous for its rainforest and sunsets.");
            seedPlace("Shivamogga", "Kodachadri", "adventurous", "friends", "13.8560", "74.8710", "A stunning mountain peak offering challenging treks and panoramic views.");
            seedPlace("Chamarajanagar", "Bandipur National Park", "adventurous", "family", "11.6660", "76.6293", "One of India's best-known tiger reserves, offering exciting wildlife safaris.");
            seedPlace("Chamarajanagar", "B R Hills", "relaxed", "couple", "11.9961", "77.1394", "A serene hill range connecting the Eastern and Western Ghats.");
            seedPlace("Ramanagara", "Ramadevara Betta", "adventurous", "friends", "12.7214", "77.2982", "Famous rocky hills where the movie Sholay was shot, also a vulture sanctuary.");
            seedPlace("Tumakuru", "Devarayanadurga", "spiritual", "family", "13.3741", "77.1699", "A rocky hill station with historic temples and beautiful forest views.");
            seedPlace("Mandya", "Shivanasamudra Falls", "relaxed", "family", "12.2961", "77.1706", "Spectacular twin waterfalls on the river Kaveri.");
            seedPlace("Mandya", "Srirangapatna", "cultural", "family", "12.4227", "76.6836", "Historical town with Tipu Sultan's summer palace and the Ranganathaswamy temple.");
            seedPlace("Bagalkot", "Pattadakal", "cultural", "solo", "15.9490", "75.8155", "A UNESCO World Heritage site featuring Chalukyan temple architecture.");
            seedPlace("Bagalkot", "Badami Caves", "cultural", "family", "15.9142", "75.6793", "Magnificent rock-cut cave temples dating back to the 6th century.");
            seedPlace("Vijayapura", "Gol Gumbaz", "cultural", "family", "16.8260", "75.7142", "The mausoleum of Mohammed Adil Shah, boasting one of the world's largest domes.");
            seedPlace("Bidar", "Bidar Fort", "cultural", "solo", "17.9220", "77.5323", "A sprawling 15th-century fort known for its impressive Islamic architecture.");
            seedPlace("Kalaburagi", "Gulbarga Fort", "cultural", "family", "17.3323", "76.8229", "A massive fort built by the Bahmani Sultans.");
            seedPlace("Belagavi", "Gokak Falls", "relaxed", "friends", "16.1950", "74.7788", "Often called the Niagara of Karnataka, featuring a hanging bridge.");
            seedPlace("Dharwad", "Unkal Lake", "relaxed", "family", "15.3725", "75.1205", "A scenic lake in Hubballi offering boating and sunset views.");
            logger.info("Massive seeding of 46 itineraries completed.");
        }
    }

    private void seedPlace(String district, String place, String category, String tripWith, String lat, String lon, String desc) {
        Itinerary i = new Itinerary();
        i.setDistrict(district);
        i.setPlace(place);
        i.setCategory(category);
        i.setTripWith(tripWith);
        i.setLatitude(lat);
        i.setLongitude(lon);
        i.setDescription(desc);
        itineraryRepo.save(i);
    }

    private void migrateUserPasswords() {
        logger.info("--- Migrating user passwords (registor table) ---");
        List<Registor> users = registerRepo.findAll();

        int migrated = 0;
        int skipped = 0;

        for (Registor user : users) {
            String email = user.getUseremail();
            String currentPassword = user.getPassword();

            if (currentPassword == null || currentPassword.isEmpty()) {
                logger.warn("Skipped (empty password): {}", email);
                skipped++;
                continue;
            }

            if (isAlreadyBCrypt(currentPassword)) {
                logger.info("Skipped (already hashed): {}", email);
                skipped++;
            } else {
                user.setPassword(passwordEncoder.encode(currentPassword));
                registerRepo.save(user);
                logger.info("Migrated user: {}", email);
                migrated++;
            }
        }

        logger.info("Users — migrated: {}, skipped: {}, total: {}", migrated, skipped, users.size());
    }

    private void migrateAdminPasswords() {
        logger.info("--- Migrating admin passwords (adminlogin table) ---");
        List<Adminlogin> admins = adminRepo.findAll();

        int migrated = 0;
        int skipped = 0;

        for (Adminlogin admin : admins) {
            String username = admin.getUsername();
            String currentPassword = admin.getPassword();

            if (currentPassword == null || currentPassword.isEmpty()) {
                logger.warn("Skipped (empty password): {}", username);
                skipped++;
                continue;
            }

            if (isAlreadyBCrypt(currentPassword)) {
                logger.info("Skipped (already hashed): {}", username);
                skipped++;
            } else {
                admin.setPassword(passwordEncoder.encode(currentPassword));
                adminRepo.save(admin);
                logger.info("Migrated admin: {}", username);
                migrated++;
            }
        }

        logger.info("Admins — migrated: {}, skipped: {}, total: {}", migrated, skipped, admins.size());
    }

    private boolean isAlreadyBCrypt(String password) {
        return password != null && (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$"));
    }
}

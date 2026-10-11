package Travel_planApi.PlanApi.Controller;

import Travel_planApi.PlanApi.Entity.Registor;
import Travel_planApi.PlanApi.Repository.RegisterInter;
import Travel_planApi.PlanApi.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registor")
public class RegistorC {

    @Autowired
    private RegisterInter reg;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SystemSettingsService systemSettingsService;

    @GetMapping("/all")
    public List<Registor> getall() {
        return reg.findAll();
    }

    @PostMapping("/PostR")
    public ResponseEntity<String> push(@RequestBody Registor obj) {
        if (!systemSettingsService.isRegistrationAllowed()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Registration is currently disabled by Administrator");
        }
        // Hash the password before saving
        obj.setPassword(passwordEncoder.encode(obj.getPassword()));
        reg.save(obj);
        return ResponseEntity.ok("Data Posted");
    }

    @DeleteMapping("/delete/{id}")
    public org.springframework.http.ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        if (!reg.existsById(id)) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body("User not found");
        }
        reg.deleteById(id);
        return org.springframework.http.ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/update/{id}")
    public org.springframework.http.ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody Registor updateDetails) {
        var existingUser = reg.findById(id).orElse(null);
        if (existingUser == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body("User not found");
        }
        
        // Only update username for now as per plan
        if (updateDetails.getUsername() != null && !updateDetails.getUsername().trim().isEmpty()) {
            existingUser.setUsername(updateDetails.getUsername());
        }
        
        reg.save(existingUser);
        
        // Return the updated user info without password
        existingUser.setPassword(null);
        return org.springframework.http.ResponseEntity.ok(existingUser);
    }
}

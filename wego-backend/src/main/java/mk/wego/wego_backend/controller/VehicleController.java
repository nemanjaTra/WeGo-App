package mk.wego.wego_backend.controller;

import lombok.RequiredArgsConstructor;
import mk.wego.wego_backend.model.User;
import mk.wego.wego_backend.model.Vehicle;
import mk.wego.wego_backend.repository.UserRepository;
import mk.wego.wego_backend.repository.VehicleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addVehicle(@RequestBody Vehicle vehicle,
                                        Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        vehicle.setUser(user);
        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Vehicle>> getMyVehicles(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(vehicleRepository.findByUserId(user.getId()));
    }
}
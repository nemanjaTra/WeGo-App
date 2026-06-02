package mk.wego.wego_backend.controller;

import lombok.RequiredArgsConstructor;
import mk.wego.wego_backend.dto.AuthRequest;
import mk.wego.wego_backend.dto.AuthResponse;
import mk.wego.wego_backend.dto.RegisterRequest;
import mk.wego.wego_backend.model.User;
import mk.wego.wego_backend.repository.UserRepository;
import mk.wego.wego_backend.security.JwtUtil;
import mk.wego.wego_backend.service.EmailService;
import mk.wego.wego_backend.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final VerificationService verificationService;

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email веќе постои!");
        }
        String code = verificationService.generateCode(email);
        emailService.sendVerificationCode(email, code);
        return ResponseEntity.ok("Кодот е испратен на " + email);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email веќе постои!");
        }

        if (!verificationService.verifyCode(request.getEmail(), request.getVerificationCode())) {
            return ResponseEntity.badRequest().body("Погрешен или истечен верификациски код!");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.PASSENGER);

        userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name()
        ));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        try {
            String credential = body.get("credential");

            com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier verifier =
                    new com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier.Builder(
                            new com.google.api.client.http.javanet.NetHttpTransport(),
                            new com.google.api.client.json.gson.GsonFactory())
                            .setAudience(java.util.Collections.singletonList(
                                    "940859404597-eau25kd34721pa95ff9l7io082a8v1g3.apps.googleusercontent.com"))
                            .build();

            com.google.api.client.googleapis.auth.oauth2.GoogleIdToken idToken = verifier.verify(credential);

            if (idToken == null) {
                return ResponseEntity.badRequest().body("Невалиден Google токен!");
            }

            com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setFirstName(firstName != null ? firstName : "Google");
                newUser.setLastName(lastName != null ? lastName : "User");
                newUser.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                newUser.setRole(User.Role.PASSENGER);
                return userRepository.save(newUser);
            });

            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(
                    token, user.getEmail(),
                    user.getFirstName(), user.getLastName(),
                    user.getRole().name()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Грешка при Google логин!");
        }
    }
}
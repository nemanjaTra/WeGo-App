package mk.wego.wego_backend.controller;

import lombok.RequiredArgsConstructor;
import mk.wego.wego_backend.model.Message;
import mk.wego.wego_backend.model.Ride;
import mk.wego.wego_backend.model.User;
import mk.wego.wego_backend.repository.MessageRepository;
import mk.wego.wego_backend.repository.RideRepository;
import mk.wego.wego_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageRepository messageRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    @GetMapping("/ride/{rideId}")
    public ResponseEntity<List<Map<String, Object>>> getMessages(
            @PathVariable Integer rideId) {
        List<Message> messages = messageRepository
                .findByRideIdOrderByCreatedAtAsc(rideId);
        List<Map<String, Object>> response = messages.stream()
                .map(m -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", m.getId());
                    map.put("content", m.getContent());
                    map.put("senderFirstName", m.getSender().getFirstName());
                    map.put("senderLastName", m.getSender().getLastName());
                    map.put("senderId", m.getSender().getId());
                    map.put("createdAt", m.getCreatedAt().toString());
                    return map;
                })
                .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        String email = authentication.getName();
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = rideRepository.findById((Integer) body.get("rideId"))
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        Message message = new Message();
        message.setRide(ride);
        message.setSender(sender);
        message.setContent((String) body.get("content"));

        messageRepository.save(message);

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", message.getId());
        result.put("content", message.getContent());
        result.put("senderFirstName", sender.getFirstName());
        result.put("senderLastName", sender.getLastName());
        result.put("senderId", sender.getId());
        result.put("createdAt", message.getCreatedAt().toString());
        return ResponseEntity.ok(result);
    }
}
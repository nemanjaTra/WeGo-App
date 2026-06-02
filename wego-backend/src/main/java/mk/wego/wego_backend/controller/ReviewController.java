package mk.wego.wego_backend.controller;

import lombok.RequiredArgsConstructor;
import mk.wego.wego_backend.dto.ReviewRequest;
import mk.wego.wego_backend.model.Review;
import mk.wego.wego_backend.model.User;
import mk.wego.wego_backend.repository.ReviewRepository;
import mk.wego.wego_backend.repository.RideRepository;
import mk.wego.wego_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RideRepository rideRepository;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request,
                                          Authentication authentication) {
        String email = authentication.getName();
        User reviewer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (reviewRepository.existsByReviewerIdAndRideId(
                reviewer.getId(), request.getRideId())) {
            return ResponseEntity.badRequest()
                    .body("Веќе си оставил оценка за ова патување!");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest()
                    .body("Оценката мора да биде помеѓу 1 и 5!");
        }

        User reviewed = userRepository.findById(request.getReviewedUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setReviewed(reviewed);
        review.setRide(rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found")));
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);

        // Ажурирај го рејтингот на корисникот
        List<Review> allReviews = reviewRepository.findByReviewedId(reviewed.getId());
        double avgRating = allReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        reviewed.setRating(avgRating);
        reviewed.setTotalRides(allReviews.size());
        userRepository.save(reviewed);

        return ResponseEntity.ok("Оценката е зачувана! Рејтинг: " + request.getRating() + "/5");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Integer userId) {
        return ResponseEntity.ok(reviewRepository.findByReviewedId(userId));
    }
}
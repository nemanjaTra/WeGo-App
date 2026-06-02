package mk.wego.wego_backend.repository;

import mk.wego.wego_backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByReviewedId(Integer reviewedId);
    boolean existsByReviewerIdAndRideId(Integer reviewerId, Integer rideId);
}
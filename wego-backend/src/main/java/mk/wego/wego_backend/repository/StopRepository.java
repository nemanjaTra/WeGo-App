package mk.wego.wego_backend.repository;

import mk.wego.wego_backend.model.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StopRepository extends JpaRepository<Stop, Integer> {
    List<Stop> findByRideIdOrderByOrderNumber(Integer rideId);
}
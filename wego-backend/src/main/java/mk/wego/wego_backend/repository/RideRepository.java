package mk.wego.wego_backend.repository;

import mk.wego.wego_backend.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Integer> {
    List<Ride> findByFromCityAndToCityAndStatus(String fromCity, String toCity, Ride.Status status);
    List<Ride> findByDriverId(Integer driverId);
    List<Ride> findByStatus(Ride.Status status);
}
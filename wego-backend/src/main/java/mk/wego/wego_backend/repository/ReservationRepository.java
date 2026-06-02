package mk.wego.wego_backend.repository;

import mk.wego.wego_backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByPassengerId(Integer passengerId);
    List<Reservation> findByRideId(Integer rideId);
    boolean existsByRideIdAndPassengerId(Integer rideId, Integer passengerId);
}
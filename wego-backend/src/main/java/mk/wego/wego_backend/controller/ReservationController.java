package mk.wego.wego_backend.controller;

import lombok.RequiredArgsConstructor;
import mk.wego.wego_backend.dto.ReservationRequest;
import mk.wego.wego_backend.dto.ReservationResponse;
import mk.wego.wego_backend.model.Reservation;
import mk.wego.wego_backend.model.Ride;
import mk.wego.wego_backend.model.User;
import mk.wego.wego_backend.repository.ReservationRepository;
import mk.wego.wego_backend.repository.RideRepository;
import mk.wego.wego_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request,
                                               Authentication authentication) {
        String email = authentication.getName();
        User passenger = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getAvailableSeats() < request.getSeatsRequested()) {
            return ResponseEntity.badRequest().body("Нема доволно слободни места!");
        }

        if (reservationRepository.existsByRideIdAndPassengerId(ride.getId(), passenger.getId())) {
            return ResponseEntity.badRequest().body("Веќе имаш резервација за ова патување!");
        }

        if (ride.getDriver().getId().equals(passenger.getId())) {
            return ResponseEntity.badRequest().body("Не можеш да резервираш свое патување!");
        }

        Reservation reservation = new Reservation();
        reservation.setRide(ride);
        reservation.setPassenger(passenger);
        reservation.setSeatsReserved(request.getSeatsRequested());
        reservation.setStatus(Reservation.Status.PENDING);

        reservationRepository.save(reservation);
        return ResponseEntity.ok(mapToResponse(reservation));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            Authentication authentication) {
        String email = authentication.getName();
        User passenger = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Reservation> reservations = reservationRepository
                .findByPassengerId(passenger.getId());
        return ResponseEntity.ok(reservations.stream()
                .map(this::mapToResponse).toList());
    }

    @GetMapping("/ride/{rideId}")
    public ResponseEntity<List<ReservationResponse>> getRideReservations(
            @PathVariable Integer rideId) {
        List<Reservation> reservations = reservationRepository.findByRideId(rideId);
        return ResponseEntity.ok(reservations.stream()
                .map(this::mapToResponse).toList());
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmReservation(@PathVariable Integer id,
                                                Authentication authentication) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Ride ride = reservation.getRide();
        ride.setAvailableSeats(ride.getAvailableSeats() - reservation.getSeatsReserved());
        rideRepository.save(ride);

        reservation.setStatus(Reservation.Status.CONFIRMED);
        reservationRepository.save(reservation);
        return ResponseEntity.ok(mapToResponse(reservation));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Integer id,
                                               Authentication authentication) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() == Reservation.Status.CONFIRMED) {
            Ride ride = reservation.getRide();
            ride.setAvailableSeats(ride.getAvailableSeats() + reservation.getSeatsReserved());
            rideRepository.save(ride);
        }

        reservation.setStatus(Reservation.Status.CANCELLED);
        reservationRepository.save(reservation);
        return ResponseEntity.ok("Резервацијата е откажана!");
    }

    private ReservationResponse mapToResponse(Reservation r) {
        ReservationResponse res = new ReservationResponse();
        res.setId(r.getId());
        res.setStatus(r.getStatus().name());
        res.setSeatsReserved(r.getSeatsReserved());
        res.setCreatedAt(r.getCreatedAt());
        res.setFromCity(r.getRide().getFromCity());
        res.setToCity(r.getRide().getToCity());
        res.setDepartureTime(r.getRide().getDepartureTime());
        res.setPricePerPerson(r.getRide().getPricePerPerson());
        res.setDriverFirstName(r.getRide().getDriver().getFirstName());
        res.setDriverLastName(r.getRide().getDriver().getLastName());
        res.setDriverPhone(r.getRide().getDriver().getPhone());
        res.setVehicleBrand(r.getRide().getVehicle().getBrand());
        res.setVehicleModel(r.getRide().getVehicle().getModel());
        res.setLicensePlate(r.getRide().getVehicle().getLicensePlate());
        res.setPassengerFirstName(r.getPassenger().getFirstName());
        res.setPassengerLastName(r.getPassenger().getLastName());
        res.setPassengerPhone(r.getPassenger().getPhone());
        return res;
    }
}
package mk.wego.wego_backend.controller;

import lombok.RequiredArgsConstructor;
import mk.wego.wego_backend.dto.RideRequest;
import mk.wego.wego_backend.dto.RideResponse;
import mk.wego.wego_backend.model.Ride;
import mk.wego.wego_backend.model.Stop;
import mk.wego.wego_backend.model.User;
import mk.wego.wego_backend.model.Vehicle;
import mk.wego.wego_backend.repository.RideRepository;
import mk.wego.wego_backend.repository.StopRepository;
import mk.wego.wego_backend.repository.UserRepository;
import mk.wego.wego_backend.repository.VehicleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RideController {

    private final RideRepository rideRepository;
    private final StopRepository stopRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    @PostMapping
    public ResponseEntity<?> createRide(@RequestBody RideRequest request,
                                        Authentication authentication) {
        String email = authentication.getName();
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setVehicle(vehicle);
        ride.setFromCity(request.getFromCity());
        ride.setToCity(request.getToCity());
        ride.setDepartureTime(request.getDepartureTime());
        ride.setPricePerPerson(request.getPricePerPerson());
        ride.setTotalSeats(request.getTotalSeats());
        ride.setAvailableSeats(request.getTotalSeats());
        ride.setNotes(request.getNotes());
        ride.setStatus(Ride.Status.ACTIVE);

        Ride savedRide = rideRepository.save(ride);

        if (request.getStops() != null) {
            for (int i = 0; i < request.getStops().size(); i++) {
                Stop stop = new Stop();
                stop.setRide(savedRide);
                stop.setCity(request.getStops().get(i));
                stop.setOrderNumber(i + 1);
                stopRepository.save(stop);
            }
        }

        return ResponseEntity.ok(mapToResponse(savedRide));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RideResponse>> searchRides(
            @RequestParam(required = false) String fromCity,
            @RequestParam(required = false) String toCity) {
        List<Ride> rides;
        if (fromCity == null || fromCity.isEmpty() || toCity == null || toCity.isEmpty()) {
            rides = rideRepository.findByStatus(Ride.Status.ACTIVE);
        } else {
            rides = rideRepository.findByFromCityAndToCityAndStatus(
                    fromCity, toCity, Ride.Status.ACTIVE);
        }
        return ResponseEntity.ok(rides.stream().map(this::mapToResponse).toList());
    }

    @GetMapping("/my")
    public ResponseEntity<List<RideResponse>> getMyRides(Authentication authentication) {
        String email = authentication.getName();
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Ride> rides = rideRepository.findByDriverId(driver.getId());
        return ResponseEntity.ok(rides.stream().map(this::mapToResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RideResponse> getRide(@PathVariable Integer id) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        return ResponseEntity.ok(mapToResponse(ride));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelRide(@PathVariable Integer id,
                                        Authentication authentication) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        ride.setStatus(Ride.Status.CANCELLED);
        rideRepository.save(ride);
        return ResponseEntity.ok("Патувањето е откажано!");
    }

    private RideResponse mapToResponse(Ride ride) {
        RideResponse response = new RideResponse();
        response.setId(ride.getId());
        response.setFromCity(ride.getFromCity());
        response.setToCity(ride.getToCity());
        response.setDepartureTime(ride.getDepartureTime());
        response.setPricePerPerson(ride.getPricePerPerson());
        response.setTotalSeats(ride.getTotalSeats());
        response.setAvailableSeats(ride.getAvailableSeats());
        response.setStatus(ride.getStatus().name());
        response.setNotes(ride.getNotes());
        response.setDriverFirstName(ride.getDriver().getFirstName());
        response.setDriverLastName(ride.getDriver().getLastName());
        response.setDriverPhone(ride.getDriver().getPhone());
        response.setDriverRating(ride.getDriver().getRating());
        response.setVehicleBrand(ride.getVehicle().getBrand());
        response.setVehicleModel(ride.getVehicle().getModel());
        response.setVehicleColor(ride.getVehicle().getColor());
        response.setLicensePlate(ride.getVehicle().getLicensePlate());
        List<Stop> stops = stopRepository.findByRideIdOrderByOrderNumber(ride.getId());
        response.setStops(stops.stream().map(Stop::getCity).toList());
        return response;
    }
}
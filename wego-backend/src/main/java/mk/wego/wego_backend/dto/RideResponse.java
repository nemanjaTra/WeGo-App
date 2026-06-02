package mk.wego.wego_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RideResponse {
    private Integer id;
    private String fromCity;
    private String toCity;
    private LocalDateTime departureTime;
    private Integer pricePerPerson;
    private Integer totalSeats;
    private Integer availableSeats;
    private String status;
    private String notes;
    private List<String> stops;
    private String driverFirstName;
    private String driverLastName;
    private Double driverRating;
    private String vehicleBrand;
    private String vehicleModel;
    private String vehicleColor;
    private String licensePlate;
    private String driverPhone;
}
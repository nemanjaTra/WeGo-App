package mk.wego.wego_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReservationResponse {
    private Integer id;
    private String status;
    private Integer seatsReserved;
    private LocalDateTime createdAt;
    private String fromCity;
    private String toCity;
    private LocalDateTime departureTime;
    private Integer pricePerPerson;
    private String driverFirstName;
    private String driverLastName;
    private String driverPhone;
    private String vehicleBrand;
    private String vehicleModel;
    private String licensePlate;
    private String passengerFirstName;
    private String passengerLastName;
    private String passengerPhone;
}
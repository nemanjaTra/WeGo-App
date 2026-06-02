package mk.wego.wego_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RideRequest {
    private Integer vehicleId;
    private String fromCity;
    private String toCity;
    private LocalDateTime departureTime;
    private Integer pricePerPerson;
    private Integer totalSeats;
    private String notes;
    private List<String> stops;
}
package mk.wego.wego_backend.dto;

import lombok.Data;

@Data
public class ReservationRequest {
    private Integer rideId;
    private Integer seatsRequested;
}
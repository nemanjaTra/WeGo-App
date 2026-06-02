package mk.wego.wego_backend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Integer rideId;
    private Integer reviewedUserId;
    private Integer rating;
    private String comment;
}
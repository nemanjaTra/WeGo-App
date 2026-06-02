package mk.wego.wego_backend.dto;

import lombok.Data;
import mk.wego.wego_backend.model.User;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private User.Role role;
    private String verificationCode;
}
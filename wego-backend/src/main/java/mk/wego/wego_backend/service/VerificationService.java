package mk.wego.wego_backend.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class VerificationService {

    private final Map<String, String> codes = new HashMap<>();
    private final Map<String, Long> expiry = new HashMap<>();

    public String generateCode(String email) {
        String code = String.format("%06d", new Random().nextInt(999999));
        codes.put(email, code);
        expiry.put(email, System.currentTimeMillis() + 10 * 60 * 1000);
        return code;
    }

    public boolean verifyCode(String email, String code) {
        if (!codes.containsKey(email)) return false;
        if (System.currentTimeMillis() > expiry.get(email)) {
            codes.remove(email);
            expiry.remove(email);
            return false;
        }
        boolean valid = codes.get(email).equals(code);
        if (valid) {
            codes.remove(email);
            expiry.remove(email);
        }
        return valid;
    }

    public boolean hasPendingCode(String email) {
        return codes.containsKey(email);
    }
}
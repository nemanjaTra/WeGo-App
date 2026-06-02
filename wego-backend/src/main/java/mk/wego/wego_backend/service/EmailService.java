package mk.wego.wego_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("WeGo — Верификациски код");
        message.setText(
                "Здраво!\n\n" +
                        "Твојот верификациски код за WeGo е:\n\n" +
                        "🔐 " + code + "\n\n" +
                        "Кодот е валиден 10 минути.\n\n" +
                        "Ако не си се регистрирал на WeGo, игнорирај го овој мејл.\n\n" +
                        "Поздрав,\nWeGo тимот 🚗"
        );
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Добредојде во WeGo! 🚗");
        message.setText(
                "Здраво " + firstName + "!\n\n" +
                        "Добредојде во WeGo — платформата за организиран заеднички превоз во Македонија!\n\n" +
                        "Со WeGo можеш:\n" +
                        "✅ Да објавуваш патувања и наоѓаш патници\n" +
                        "✅ Да резервираш место кај други возачи\n" +
                        "✅ Да комуницираш со возачот и патниците\n\n" +
                        "Среќно патување!\n\n" +
                        "Поздрав,\nWeGo тимот 🚗"
        );
        mailSender.send(message);
    }
}
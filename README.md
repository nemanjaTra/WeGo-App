# 🚗 WeGo — Веб апликација за организиран заеднички превоз

WeGo е moderna full-stack веб апликација за карпулинг (заеднички превоз) наменета за корисници во Македонија. Апликацијата овозможува возачите да објавуваат патувања, а патниците да резервираат места и комуницираат во реално време.

---

## 📋 Содржина

- [Опис](#опис)
- [Технологии](#технологии)
- [Функционалности](#функционалности)
- [Структура на проектот](#структура-на-проектот)
- [Инсталација](#инсталација)
- [API Endpoints](#api-endpoints)
- [База на податоци](#база-на-податоци)
- [Автор](#автор)

---

## 📖 Опис

WeGo е дипломска работа развиена на Факултетот за компјутерски науки и инженерство (ФИНКИ), Скопје. Апликацијата решава реален проблем — организирање на заеднички превоз помеѓу градовите во Македонија, со цел намалување на трошоците за патување и позитивно влијание врз животната средина.

---

## 🛠 Технологии

### Backend
- **Java 24** — програмски јазик
- **Spring Boot 3.5.14** — веб framework
- **Spring Security + JWT** — автентикација и авторизација
- **Spring Data JPA / Hibernate** — ORM за база на податоци
- **MySQL 8.0** — релациска база на податоци
- **Spring Mail** — испраќање на е-пошта
- **Google OAuth2** — логирање преку Google

### Frontend
- **React 18** — JavaScript UI library
- **Vite** — build tool
- **React Router DOM** — навигација
- **Axios** — HTTP клиент
- **Leaflet / React-Leaflet** — интерактивни мапи
- **@react-oauth/google** — Google OAuth интеграција

### Алатки
- **IntelliJ IDEA** — Backend развој
- **WebStorm** — Frontend развој
- **DataGrip** — Управување со база
- **Postman** — Тестирање на API
- **Git / GitHub** — Верзиска контрола

---

## ✨ Функционалности

### Автентикација
- ✅ Регистрација со верификација преку е-пошта (6-цифрен код)
- ✅ Логирање со е-пошта и лозинка
- ✅ Логирање преку Google OAuth2
- ✅ JWT токени за сигурна автентикација
- ✅ Welcome е-пошта при регистрација

### Возач
- ✅ Додавање возило
- ✅ Објавување патување со детали (рута, цена, места, постанки)
- ✅ Преглед на сопствени возења
- ✅ Прифаќање и одбивање на резервации
- ✅ Комуникација со патниците преку chat

### Патник
- ✅ Пребарување патувања по рута
- ✅ Резервирање место (PENDING статус)
- ✅ Откажување резервација
- ✅ Chat со возачот и другите патници (само по потврда)

### Општо
- ✅ Интерактивна Leaflet мапа со рута и километража
- ✅ Dark / Light theme
- ✅ Профил со слика
- ✅ Систем за оценување (рејтинг)
- ✅ Реално-временски chat (polling на секои 5 секунди)

---

## 📁 Структура на проектот

WeGo-App/
├── wego-backend/          # Spring Boot REST API
│   ├── src/main/java/
│   │   └── mk/wego/wego_backend/
│   │       ├── controller/    # REST контролери
│   │       ├── model/         # Entity класи
│   │       ├── repository/    # JPA репозитории
│   │       ├── security/      # JWT конфигурација
│   │       ├── service/       # Бизнис логика
│   │       └── dto/           # Data Transfer Objects
│   └── src/main/resources/
│       └── application.properties
│
├── wego-frontend/         # React апликација
│   └── src/
│       ├── api/           # Axios конфигурација
│       ├── components/    # Споделени компоненти
│       ├── context/       # React Context (Auth, Theme)
│       └── pages/         # Страници
│
└── wego-database/         # SQL шема
└── wego_schema.sql

---

## 🚀 Инсталација

### Предуслови
- Java 17+
- Node.js 18+
- MySQL 8.0
- Maven

### Backend

```bash
# 1. Клонирај го репозиториумот
git clone https://github.com/nemanjaTra/WeGo-App.git
cd WeGo-App/wego-backend

# 2. Креирај база на податоци
mysql -u root -p
CREATE DATABASE wego_db;
exit

# 3. Увези ја шемата
mysql -u root -p wego_db < ../wego-database/wego_schema.sql

# 4. Конфигурирај application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/wego_db
spring.datasource.username=root
spring.datasource.password=ТВОЈАТА_ЛОЗИНКА

# 5. Стартувај го backend-от
mvn spring-boot:run
```

### Frontend

```bash
# 1. Оди во frontend папката
cd WeGo-App/wego-frontend

# 2. Инсталирај dependencies
npm install

# 3. Стартувај го frontend-от
npm run dev

# Апликацијата е достапна на http://localhost:5173
```

---

## 📡 API Endpoints

### Автентикација
| Метод | Endpoint | Опис |
|-------|----------|------|
| POST | `/api/auth/send-code` | Испраќа верификациски код |
| POST | `/api/auth/register` | Регистрација |
| POST | `/api/auth/login` | Логирање |
| POST | `/api/auth/google` | Google OAuth логирање |

### Возила
| Метод | Endpoint | Опис |
|-------|----------|------|
| POST | `/api/vehicles` | Додај возило |
| GET | `/api/vehicles/my` | Мои возила |

### Возења
| Метод | Endpoint | Опис |
|-------|----------|------|
| POST | `/api/rides` | Креирај возење |
| GET | `/api/rides/search` | Пребарај возења |
| GET | `/api/rides/my` | Мои возења |
| GET | `/api/rides/{id}` | Детали за возење |
| DELETE | `/api/rides/{id}` | Откажи возење |

### Резервации
| Метод | Endpoint | Опис |
|-------|----------|------|
| POST | `/api/reservations` | Резервирај место |
| GET | `/api/reservations/my` | Мои резервации |
| GET | `/api/reservations/ride/{id}` | Резервации за возење |
| PUT | `/api/reservations/{id}/confirm` | Потврди резервација |
| PUT | `/api/reservations/{id}/cancel` | Откажи резервација |

### Chat
| Метод | Endpoint | Опис |
|-------|----------|------|
| GET | `/api/messages/ride/{id}` | Порaki за возење |
| POST | `/api/messages` | Испрати порака |

### Корисници
| Метод | Endpoint | Опис |
|-------|----------|------|
| GET | `/api/users/me` | Мој профил |
| POST | `/api/users/upload-photo` | Качи профилна слика |

---

## 🗄 База на податоци

Базата се состои од 7 табели:

| Табела | Опис |
|--------|------|
| `users` | Корисници (возачи и патници) |
| `vehicles` | Возила на возачите |
| `rides` | Објавени патувања |
| `stops` | Постанки за патување |
| `reservations` | Резервации на места |
| `reviews` | Оценки на корисници |
| `messages` | Chat пораки |

---

## 👨‍💻 Автор

**Немања Трајановски**  
Факултет за компјутерски науки и инженерство (ФИНКИ)  
Универзитет Св. Кирил и Методиј, Скопје  
Ментор: проф. д-р Иван Чорбев  
2026

---

## 📄 Лиценца

Овој проект е развиен како дипломска работа и е наменет само за образовни цели.

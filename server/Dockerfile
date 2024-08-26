# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY src/main/resources/application.properties /app/application.properties

ENV SPRING_DATASOURCE_URL=jdbc:sqlite:/app/tuned_users.db
ENV SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.sqlite.JDBC
ENV SPRING_JPA_DATABASE_PLATFORM=org.hibernate.community.dialect.SQLiteDialect
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
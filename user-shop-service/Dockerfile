# Stage 1: Build the app using Gradle
FROM gradle:7.6.1-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/project
WORKDIR /home/gradle/project
RUN gradle build --no-daemon

# Stage 2: Run the Spring Boot app
FROM openjdk:17-jdk-slim
COPY --from=build /home/gradle/project/build/libs/user-shop-service-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
EXPOSE 8080

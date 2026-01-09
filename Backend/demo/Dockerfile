# Use official Gradle image with JDK 21 to build the app
FROM gradle:8.5-jdk21 AS build

WORKDIR /home/gradle/projects/demo

COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts ./

COPY src src

RUN ./gradlew bootJar --no-daemon -x test

# Runtime stage 
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /home/gradle/projects/demo/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
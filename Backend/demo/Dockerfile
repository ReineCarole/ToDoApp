# Use official Gradle image with JDK 21 to build the app
FROM gradle:8.5-jdk21 AS build

WORKDIR /home/gradle/projects/demo

COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts ./

RUN chmod +x gradlew

COPY src ./src

RUN ./gradlew bootJar --no-daemon -x test

# Runtime stage 
FROM eclipse-temurin:21-jdk

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=build /home/gradle/projects/demo/build/libs/*.jar app.jar

RUN chown appuser:appgroup app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
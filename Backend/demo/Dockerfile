# Use official Gradle image with JDK 21 to build the app
FROM gradle:8.5-jdk21 AS build
COPY . /demo/src

WORKDIR /demo/src
RUN gradle bootJar --no-daemon -x test

# Runtime stage 
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /demo/src/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
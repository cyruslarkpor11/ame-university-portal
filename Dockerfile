# Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/university-eportal-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir -p /app/Images
EXPOSE 10000
CMD ["java", "-jar", "app.jar"]

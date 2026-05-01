# Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -q

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/university-eportal-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir -p /app/Images

# Install wget for healthcheck
RUN apk add --no-cache wget

# Railway assigns PORT dynamically
ENV PORT=8080
EXPOSE 8080

# Start command - Use PORT from environment, fallback to 8080
CMD ["sh", "-c", "java -Xmx512m -Xms256m -jar app.jar"]

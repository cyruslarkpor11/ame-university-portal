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

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget -q --spider http://localhost:${PORT}/actuator/health || exit 1

# Start command
CMD ["sh", "-c", "java -Xmx512m -Xms256m -jar app.jar --server.port=${PORT}"]

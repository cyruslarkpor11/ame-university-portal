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

# Create data directory for H2 database
RUN mkdir -p /app/data && chmod 777 /app/data

# Railway assigns PORT dynamically
ENV PORT=8080
ENV JAVA_OPTS="-Xmx512m -Xms256m"
EXPOSE 8080

# Use shell form to allow PORT env var expansion
CMD java ${JAVA_OPTS} -jar app.jar --server.port=${PORT}

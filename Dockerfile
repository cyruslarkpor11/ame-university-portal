# Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src

# Build with reduced memory
RUN mvn clean package -DskipTests -Dmaven.test.skip=true --no-transfer-progress

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the specific JAR file
COPY --from=build /app/target/university-eportal-*.jar app.jar

# Create directories for static resources
RUN mkdir -p /app/Images /app/static/Images

EXPOSE 10000

# Environment variables
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SERVER_PORT=10000

# Start the application
CMD exec java $JAVA_OPTS -Dserver.port=$SERVER_PORT -jar app.jar

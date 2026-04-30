# Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Create Images directory and copy static images
RUN mkdir -p /app/Images
COPY --from=build /app/src/main/resources/static/Images/ /app/Images/ 2>/dev/null || echo "No images to copy"

EXPOSE 10000

ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SERVER_PORT=10000

CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

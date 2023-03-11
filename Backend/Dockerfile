# Use Java as the base image
FROM openjdk:latest

# Create a working directory
WORKDIR /app

# Copy the project files into the image
COPY . .

# Build all the dependencies in preparation to go offline.
# This is a separate step so the dependencies will be cached unless
# the pom.xml file has changed.
RUN ./mvnw dependency:go-offline -B

# Build the Spring Boot project
RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# Copy the jar file into the image
COPY target/Backend.jar .

# Start the server
CMD ["java", "-jar", "Backend.jar"]

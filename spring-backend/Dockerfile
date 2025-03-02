FROM maven:3.9.9
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Expose the port
EXPOSE 8080

# Run the application in dev mode
CMD ["mvn", "spring-boot:run"]

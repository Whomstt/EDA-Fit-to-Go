FROM maven:3.9.9
WORKDIR /app

COPY pom.xml .
COPY src ./src

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]

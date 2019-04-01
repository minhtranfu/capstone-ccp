# for builder
FROM maven:3.6.0-jdk-8-alpine as builder

# application placed into /opt/app
RUN mkdir -p /opt/app
WORKDIR /opt/app

# selectively add the POM file and
# install dependencies
COPY pom.xml /opt/app/
RUN ["/usr/local/bin/mvn-entrypoint.sh", "mvn", "dependency:go-offline"]

# rest of the project
COPY src /opt/app/src
#RUN mvn install and package
RUN ["/usr/local/bin/mvn-entrypoint.sh", "mvn", "verify", "clean", "install", "--fail-never"]
# package project
RUN mvn tomee:build

# create excutable file
RUN mvn tomee:exec

# for runner
FROM openjdk:8-jre-alpine
RUN mkdir -p /app
COPY --from=builder /opt/app/target /app/capstone
# local application port
EXPOSE 8080

# execute it
#CMD ["mvn", "tomcat7:run-war-only"]
CMD ["java" , "-jar", "/app/capstone/CcpApi-exec.jar"]

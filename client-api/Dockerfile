# fetch basic image
FROM maven:3.3.9-jdk-8

# application placed into /opt/app
RUN mkdir -p /opt/app
WORKDIR /opt/app

# selectively add the POM file and
# install dependencies
COPY pom.xml /opt/app/

# rest of the project
COPY src /opt/app/src
#RUN mvn install and package
RUN ["/usr/local/bin/mvn-entrypoint.sh", "mvn", "verify", "clean", "package", "--fail-never"]
# package project
#RUN mvn package

# local application port
EXPOSE 8080

# execute it
CMD ["mvn", "tomcat7:run-war-only"]
# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Install EF Tool
RUN dotnet tool install --global dotnet-ef --version 7.0.11
ENV PATH="$PATH:/root/.dotnet/tools"

COPY ./init.sql /app/init.sql
COPY entrypoint.sh /app/entrypoint.sh

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the files and build the app
COPY . ./
RUN dotnet publish -c Release -o out /p:DockerBuild=true

# Generate migration scripts
RUN dotnet ef migrations script --idempotent -o /app/migrations.sql --context ApplicationDbContext

# Stage 2: Build the frontend
FROM node:18 AS frontend
WORKDIR /app

COPY ClientApp/ ./
RUN npm install
RUN npm run build

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app

# Install Netcat
USER root
RUN apt-get update && apt-get install -y netcat postgresql-client && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/out ./
COPY --from=build /app/init.sql ./init.sql
COPY --from=build /app/migrations.sql ./migrations.sql
COPY --from=build /app/entrypoint.sh ./entrypoint.sh
COPY --from=frontend /app/build ./wwwroot
RUN chmod +x /app/entrypoint.sh

# Set Environment Variables
ENV ASPNETCORE_URLS="http://+:5039"
ENV ASPNETCORE_HOSTINGSTARTUPASSEMBLIES="Microsoft.AspNetCore.SpaProxy"

# Create a user
RUN adduser --disabled-password --gecos '' myuser

RUN chown -R myuser:myuser /app
# Switch to the new user
USER myuser
WORKDIR /app

# Expose ports from launchSettings.json
EXPOSE 5039

ENTRYPOINT ["./entrypoint.sh"]
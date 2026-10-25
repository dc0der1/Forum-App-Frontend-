# Commonly 
**Appens syfte är att användaren kan logga eller skapa konto och publicera en post så att andra folk kan se det och skapa diskutioner. Just nu användaren kan inte ladda upp video eller bilder.**

## REST API
Den REST API som jag använder är den som jag har byggt själv i Spring Boot med PostgreSQL databas. Jag använder inget externt API i backend eller frontend än. Här nedan är github repo för min API:
https://github.com/dc0der1/Forum-App-Backend-

## Viktigaste funktioner
De absolut viktigaste funktioner är att skapa posts och hämta posts från backend. Utan de så kan man inte ta bort, redigera eller filtrera posts.

## Lokal Lagring
Just nu använder jag SecureStore för lokal lagring för att spara jwt token och användarens UUID. 

## Mobil funktion
Just nu använder jag share funktion där användaren kan dela deras post eller någon annans post till en kompis eller familj.

## Projekt installation (Frontend)
1. Klona ned projektet eller ladda ned den som .zip fil och extrahera deb. 
2. Kör följande kommando: 
npm install expo
npm install @expo/vector-icons
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install expo-secure-store
npm install react-native-element-dropdown
npm install react-native-vector-icons
3. Sen brukar jag köra cd forum-app för att komma åt projektet.
4. Sista kommando är npm start. Så är projektet igång

## Projekt installation (Backend)
Innan du börjar så tror jag att det är lättare om du använder docker för att köra databas med terminal. 
Också för att databasen kräver att man har docker desktop på.
Så har jag gjort i alla fall.
1. Klona ned projektet eller ladda ned den som .zip fil och extrahera deb. 
2. Efter att du har installerat postgres kör följande commando i command prompt.
    För att "ladda eller hämta" ned postgres.
    > [!NOTE]
    > Du kan nämna lösenord och namn vad du vill. Spara det någonstans för att det är viktigt till senare instruktioner.
    1. docker pull postgres
    2. docker run -p 5432:5432 -e POSTGRES_PASSWORD=DINPASSWORD --name DINCONTAINERNAMN -d postgres
    3. docker start DINCONTAINERNAMN
    4. docker exec -it DINCONTAINERNAMN bash
    5. psql -U postgres
    6. CREATE DATABASE forumdb;
    7. \c forumdb
3. Sen går du till din code editor (Exempelvis Intellij) och gå leta efter resources mapp i mappen så finns det application.properties. Där lägger du din container och databas information. Så kan du sen kopiera och klistra in de här i properties:

spring.datasource.url=jdbc:postgresql://localhost:5432/forumdb
spring.datasource.username=DINCONTAINERNAMN
spring.datasource.password=DINPASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

Så har du nu en fungerande databas. Om du vill testa API:et så kan du använda Postman eller Bruno. Båda fungerar bra.

> [!IMPORTANT]
> Starta upp först backend projektet så att frontend kan skicka requests till backend. Sen starta upp frontend efter det.
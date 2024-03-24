# OpenBarber


OpenBarber ist ein Reservierungsmanagementsystem speziell für Friseure.
Kunden können nach Friseuren in bestimmten Städten suchen und bei Bedarf einen Termin reservieren.
Die Friseure werden über Reservierungen informiert.
Zudem können Friseure kontaktiert, bewertet und favorisiert werden.

OpenBarber offers a solution for hairdressers to manage reservations. Moreover, guests can make online reservations, contact and rate hairdressers. 

Used technologies 
- React
- Java Spring
- PostgreSQL
- Docker

OpenBarber is a reservation management system for hairdressers. 
Customers can search for hairdressers in specific cities and reserve an appointment if needed.
The hairdressers are informed about reservations.
Furthermore, you can contact barbers, rate them and save them as favorites!

# Setup

Run `docker-compose -f docker-compose.yml up`

If you get error ` /bin/sh: ./mvnw: /bin/sh^M: bad interpreter: No such file or directory `,
open `mvnw` with an editor such as vim or vi.
- `vim mvnw`
- Press `ESC`
- type `:set fileformat=unix`
- save it with `:x!` or `:wq!`

You may need to build an artifact.

- Open the Backend project with IntelliJ and create an artifact with Maven

# Create Artifact wiht Maven
1. Open Maven Panel: On the right side of the IntelliJ IDEA interface, there's a vertical tab labeled "Maven". Click on it to open the Maven Projects panel.

2. Lifecycle: In the Maven Projects panel, you'll see your project's hierarchy. Expand your project's root and locate the "Lifecycle" section.

3. Clean and Install: First, double-click on clean to clean your project (this step is optional but recommended). Then, double-click on install. This will build your project and create the JAR file.

4. Find the JAR: After the build completes, the JAR file will be located in the target directory within your project's root directory.


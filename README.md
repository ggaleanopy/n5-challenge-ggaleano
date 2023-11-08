# n5-challenge-ggaleano
Repositorio del challenge para el cargo de Tech Lead de N5.

El repositorio tiene dos proyectos principales una web api en .Net Core 6 y un front en NextJS. El código fuente de ambos proyectos está disponible en los directorios N5NowWebApi y n5-material-ui, respectivamente.

Los demás archivos son utilizados por el docker para restaurar los servicios que permiten interactuar con la plataforma con sólo restaurar los contenedores. 

# Pasos a seguir para restaurar

- Clonar el repositorio con el comando *git clone https://github.com/ggaleanopy/n5-challenge-ggaleano* en alguna carpeta local
- Ingresar a cmd o bash y ejecutar *docker-compose up* dentro de la carpeta *n5-challenge-ggaleano* (se debe tener Docker instalado, 3 GB de espacio en disco y una máquina al menos dual core con 16 GB de RAM).

# Servicios disponibles

- En *http://localhost:30000* está disponible el front, se trata de una aplicación React en NextJS con Material-Ui (Contenedor: *front-container*).
- En *http://localhost:32771/swagger/index.html* se encuentra un Swagger para probar la web API si así se desea. La raíz de la web API es *http://localhost:32771/api/* (Contenedor: *webapi-container*).
- El ElasticSearch está disponible en *http://localhost:9201* y el Kibana en *http://localhost:5602* (Contenedores: *elasticsearch-container* y *kibana-container*).
- El Kafka escucha en *localhost:9092* del contenedor llamado *kafka-container*. Para crear un consumidor del Kafka es necesario utilizar el siguiente comando:

    docker run -it --rm --network n5-challenge-ggaleano_default confluentinc/cp-kafka /bin/kafka-console-consumer --bootstrap-server kafka:9092 --topic permissions_topic --from-beginning

# Notas

- Para poder ejecutar las pruebas unitarias y de integración es necesario restaurar el proyecto en Visual Studio 2022 y apuntar el servidor de base de datos en appsettings.json a *localhost:1431* en lugar de a *database:1433*.

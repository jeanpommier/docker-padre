
PostgreSQL container for hosting the geonetwork DB:
---------------------------------------------------

1) create a named volume to persist data :

docker volume create --name pgdata-volume

2) Build the postgresql image (hosting the DB for geonetwork) ;

	docker build -t padre1-pg postgresql/

Running an instance of this image :

	docker run --name pg --rm  -d padre1-pg

3) Run an instance using the data volume :

	docker run --name pg -d --rm -e PGDATA=/var/lib/postgresql/data/pgdata -v pgdata-volume:/var/lib/postgresql/data/pgdata padre1-pg

Connect to it and execute commands :

	docker exec -it pg /bin/bash

4) import existing geonetwork DB :
- get the container's IP
- in the SQL dump file,
    * alter all ALTER SCHEMA geoportal OWNER TO sequences
    * comment out the DROP/CREATE part & change the DB name to be created by geonetwork in the \connect line
- push the SQL content in the newly create geonetwork DB : psql -h 172.17.0.2 -U postgres < ~/tmp/gabon/gabon_mines_gn2_10

Note : the pgsql image does not seem to recognize the fr_FR.UTF8 collation : remove the collation part, it will do fine.

Geonetwork container
--------------------

1) create a named volume to persist data :

docker volume create --name gndata-volume

2) Build the image :

	docker build -t padre1-gn geoportal/

Run a container from this image:

	docker run --name gn --link pg:pg  -p 8080 -e POSTGRES_DB_USERNAME=geonetwork -e POSTGRES_DB_PASSWORD=geonetwork --rm padre1-gn
	(add -d if you want it as daemon)

3) Run using the data volume & publishing the service on port 8083:

	docker run --name gn --link pg:pg  -p 8083:8080 -e POSTGRES_DB_USERNAME=geonetwork -e POSTGRES_DB_PASSWORD=geonetwork -e DATA_DIR=/var/padre/geonetwork_datadir --rm  -v gndata-volume:/var/padre/geonetwork_datadir padre1-gn

4) Import the geonetwork_datadir :

-  Go into the volume (can be done as root from host system), and replace the datadir if present (or put its content in _data)
-  Restart the container

TODO:
- more configurable, so as to customize the geoportal according to the project on runtime instead of having to build the image again for some minor text change for instance

PostGIS container (for Geodata DB)
----------------------------------

1) create a named volume to persist data :

docker volume create --name postgisdata-volume

2) Build the image :

	docker build -t padre1-postgis postgis/


3) Run an instance using the data volume :

	docker run --name pgis -d --rm -e PGDATA=/var/lib/postgresql/data/pgdata -v postgisdata-volume:/var/lib/postgresql/data/pgdata padre1-postgis

	Si on veut le créer depuis le depots dockerhub:
	docker run --name pgis -d --rm -e PGDATA=/var/lib/postgresql/data/pgdata -v postgisdata-volume:/var/lib/postgresql/data/pgdata jeanpommier/padre1-postgis

4) import existing DB :

- get the container's IP
- in the SQL dump file,
    * alter all ALTER SCHEMA geoportal OWNER TO sequences
    * comment out the DROP/CREATE part & change the DB name to be created by geodata in the \connect line
- push the SQL content in the newly create geonetwork DB : psql -h 172.17.0.2 -U postgres < ~/tmp/gabon/gabon_mines_geodata
- seems some views are not imported correctly : check them. If necessary, create them : use pgAdmin3 to get the proper views definition, then psql to the databse and execute the definition. There aren't many views, it will be quick

Note : the pgsql image does not seem to recognize the fr_FR.UTF8 collation : remove the collation part, it will do fine.

GeoServer container
-------------------

1) create a named volume to persist data :

docker volume create --name gsdata-volume

2) Build the image :

	docker build -t padre1-gs geoserver/

3) Run a container from this image using the data volume & publishing the service on port 8082 & connecting with PostGIS DB :

docker run --name gs -p 8082:8080 --link pgis:pgis --rm -v gsdata-volume:/usr/local/tomcat/webapps/geoserver/data padre1-gs


4) Import the geoserver_datadir :

-  Go into the volume (can be done as root from host system), and replace the datadir if present (or put its content in _data)
-  Restart the container


Apache2.2 + PHP5 container
--------------------------

1) create a named volume to persist data :

docker volume create --name wwwdata-volume

2) Build the image :

We will customize the php:5-apache container:

	docker build -t padre1-httpd httpd/


Run a container from this image using the data volume & publishing the service on port 80 (default, see Dockerfile):

  docker run --name httpd -p 80:80 --link pgis:pgis --rm -v wwwdata-volume:/var/www/html/ \
			-e APACHE_SERVERNAME=admin.pigeo.fr \
			-e POSTGRES_HOST=pgis \
			-e POSTGRES_PORT=5432 \
			-e POSTGRES_DEFAULTDB=geodata \
			padre1-httpd


commandline SSH + geo-tools console client
----------------------------------
1) create a named volume to persist users space :

docker volume create --name sshd-home-volume

2) Build the image :

	docker build -t pigeosolutions/padre-commandline:essai commandlinetools/

3) Run the container :

docker run -it --name commandlinetools --rm -p 2222:22 -v /home/jean/.ssh/id_rsa.pub:/etc/authorized_keys/jean \
                                                   -v sshd-home-volume:/home \
                                                   -v gsdata-volume:/padre/geoserver-data \
                                                    -e SSH_USERS="jean:1000:2000" \
													-e PIGEO_USERS_SUPPORT="true" -e GEOSERVER_NS="ci" \
													pigeosolutions/padre-commandlinetools:essai

4) if OK, I can push it to my dockerhub account :
docker push pigeosolutions/padre-commandline:essai

Owncloud
--------
1) create a named volume to persist owncloud data

	docker volume create --name owncloud-data-volume

2) Build the image :

	source owncloud-server/.env
	IMAGE_NAME=padre1-owncloudserver
	docker build   	--build-arg VERSION=${VERSION} \
					--build-arg TARBALL=${TARBALL} \
					--build-arg BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
					--build-arg VCS_REF=$(git rev-parse --short HEAD) \
						-t ${IMAGE_NAME} owncloud-server/

3) Run the container : (using default sqlite DB)

	docker run -ti --rm --name owncloud -p 84:80 padre1-owncloudserver


ODK Aggregate
-------------

Build the image :

	docker build -t padre1-odkaggregate --no-cache odkaggregate/

Run a container :

	- start the postgis container to link with odkaggregate
	- create the schema odk1 inside if necessary
	- docker run --name aggregate --rm -p 8085:8080 --link pgis:pgis \
		  -e DB_HOSTNAME=pgis \
		  -e DB_USER=geonetwork \
		  -e DB_PASSWORD=geonetwork \
		  -e DB_DATABASE=geodata \
		  -e DB_SCHEMA=odk1 \
		  -e DB_PORT=5432 \
		  padre1-odkaggregate

to use HTTPS, add environment variable ODK_CHANNELTYPE=REQUIRES_SECURE_CHANNEL at first run

**TODO** : find how to use HTTPS (needs certificates, I guess)

Docker compose
--------------

Stack fonctionnel, utilisable avec docker-compose

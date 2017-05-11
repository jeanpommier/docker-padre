#!/bin/bash

set -eu

if [ ! -f /finished-setup ]; then
  echo "---- Running ODK Aggregate Setup ---"

  echo "---- Updating ODK Aggregate configuration ----"
  mkdir -p /odktmp
  mkdir -p /odksettingstmp
  pushd /odktmp
  unzip /ODKAggregate.war WEB-INF/lib/ODKAggregate-settings.jar > /dev/null 2>&1
  unzip /odktmp/WEB-INF/lib/ODKAggregate-settings.jar security.properties jdbc.properties > /dev/null 2>&1

  echo "---- Environment Variables ----"
  echo "ODK_PORT=$ODK_PORT"
  echo "ODK_PORT_SECURE=$ODK_PORT_SECURE"
  echo "ODK_HOSTNAME=$ODK_HOSTNAME"
  echo "ODK_ADMIN_USER=$ODK_ADMIN_USER"
  echo "ODK_ADMIN_USERNAME=$ODK_ADMIN_USERNAME"
  echo "ODK_AUTH_REALM=$ODK_AUTH_REALM"
  echo "ODK_CHANNELTYPE=$ODK_CHANNELTYPE"
  echo "DB_HOSTNAME=$DB_HOSTNAME"
  echo "DB_PORT=$DB_PORT"
  echo "DB_DATABASE=$DB_DATABASE"
  echo "DB_SCHEMA=$DB_SCHEMA"
  echo "DB_USER=$DB_USER"
  echo "CATALINA_HOME=$CATALINA_HOME"

  echo "---- Modifying ODK Aggregate security.properties ----"
  echo "Updating security.server.port"
  sed -i -E "s|^(security.server.port=)([0-9]+)|\1$ODK_PORT|gm" security.properties
  echo "Updating security.server.securePort"
  sed -i -E "s|^(security.server.securePort=)([0-9]+)|\1$ODK_PORT_SECURE|gm" security.properties
  echo "Updating security.server.hostname"
  sed -i -E "s|^(security.server.hostname=)([A-Za-z\.0-9]+)|\1$ODK_HOSTNAME|gm" security.properties
  echo "Updating security.server.superUser"
  sed -i -E "s|^(security.server.superUser=).*|\1$ODK_ADMIN_USER|gm" security.properties
  echo "Updating security.server.superUserUsername"
  sed -i -E "s|^(security.server.superUserUsername=).*|\1$ODK_ADMIN_USERNAME|gm" security.properties
  echo "Updating security.server.realm.realmString"
  sed -i -E "s|^(security.server.realm.realmString=).*|\1$ODK_AUTH_REALM|gm" security.properties
  echo "Updating security.server.secureChannelType"
  sed -i -E "s|^(security.server.secureChannelType=)([A-Z_]+)|\1$ODK_CHANNELTYPE|gm" security.properties
  sed -i -E "s|^(security.server.channelType=)([A-Z_]+)|\1$ODK_CHANNELTYPE|gm" security.properties

  echo "---- Modifying ODK Aggregate jdbc.properties ----"
  sed -i -E "s|^(jdbc.url=jdbc:postgresql://).+(\?autoDeserialize=true)|\1$DB_HOSTNAME:$DB_PORT/$DB_DATABASE\2|gm" jdbc.properties
  sed -i -E "s|^(jdbc.url=jdbc:postgresql:///)(.+)(\?autoDeserialize=true)|\1""\3|gm" jdbc.properties
  sed -i -E "s|^(jdbc.schema=).*|\1$DB_SCHEMA|gm" jdbc.properties
  sed -i -E "s|^(jdbc.username=).*|\1$DB_USER|gm" jdbc.properties
  sed -i -E "s|^(jdbc.password=).*|\1$DB_PASSWORD|gm" jdbc.properties

  echo "---- Rebuilding ODKAggregate-settings.jar ----"
  zip -g WEB-INF/lib/ODKAggregate-settings.jar jdbc.properties security.properties > /dev/null 2>&1
  echo "---- Rebuilding ODKAggregate.war ----"
  zip -g /ODKAggregate.war WEB-INF/lib/ODKAggregate-settings.jar > /dev/null 2>&1
  popd
  rm -rf /odktmp

  echo "---- Deploying ODKAggregate.war to $CATALINA_HOME/webapps/ROOT.war ----"
  rm -rf $CATALINA_HOME/webapps
  [ -d /var/lib/tomcat8/webapps ] || mkdir -p $CATALINA_HOME/webapps
  cp /ODKAggregate.war $CATALINA_HOME/webapps/

  touch /finished-setup

  echo "---- Tomcat & ODK Aggregate Setup Complete ---"
fi

exec $CATALINA_HOME/bin/catalina.sh run "$@"

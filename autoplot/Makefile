# To install Jetty, start servlet, and test:
#   make all
#
# To test:
#   make test

PORT=8001
AUTOPLOT_DATA=/tmp/autoplot_data
JETTY=jetty-distribution-8.1.16.v20140903
JAVA_OPTIONS="-DAUTOPLOT_DATA=$(AUTOPLOT_DATA) -Xmx1024m"
#JAVA="/usr/local/jdk1.8.0_66/jre/bin/java"
JAVA="java"
SERVLETBASE="http://localhost:$(PORT)/AutoplotServlet"
WARURL="http://autoplot.org/hudson/job/autoplot-jar-servlet/lastSuccessfulBuild/artifact/autoplot/AutoplotServlet/dist/AutoplotServlet.war"

all:
	make install
	make test

start:
	cd deps/jetty; JAVA=$(JAVA) JAVA_OPTIONS=$(JAVA_OPTIONS) JETTY_PORT=$(PORT) bash bin/jetty.sh start;

stop:
	- cd deps/jetty; JETTY_PORT=$(PORT) bash bin/jetty.sh stop; 

update:
	curl $(WARURL) > AutoplotServlet.war

install:
	mkdir -p deps;
	cd deps; unzip -q -o ../$(JETTY).zip
	cd deps; cp ../AutoplotServlet.war $(JETTY)/webapps
	cd deps; rm -f jetty; ln -s $(JETTY) jetty
	cp jetty-logging.xml deps/jetty/etc

test:
	make start
	echo "Testing $(SERVLETBASE)/SimpleServlet?url=vap%2Binline:rand(300)"
	curl -s "$(SERVLETBASE)/SimpleServlet?url=vap%2Binline:rand(300)" > test.png
	test -n "$$(find test.png -maxdepth 1 -size +10k)" # Failure file size is < 10k.  Not a robust test.
	echo "PASS"
	make stop

clean:
	rm -rf $(AUTOPLOT_DATA)
	rm -f *.class
	rm -rf deps/*
	rm -f test*.png

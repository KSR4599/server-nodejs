for i in {1..30}; do 
	#time curl -o a.dat http://localhost:8999/autoplot_test.dat	
	rm -rf /tmp/autoplot_data/fscache/http/
	time curl -o a -s "http://localhost:8001/AutoplotServlet/SimpleServlet?url=vap%2Bdat%3Ahttp%3A%2F%2Flocalhost%3A8999%2Fautoplot_test.dat%3Fdepend0%3Dfield1%26column%3Dfield0" 1>&2
	ls -l a
	sleep 1
done
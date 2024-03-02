URL=pvnas.tail23302.ts.net/autoshack
docker tag shack_server $URL/shack_server
docker push $URL/shack_server

docker tag shack_web $URL/shack_web
docker push $URL/shack_web
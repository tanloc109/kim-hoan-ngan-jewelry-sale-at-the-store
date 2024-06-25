echo "Building app..."
./mvnw clean package

echo "Deploy files to server..."
scp -r -i ~/Desktop/demo-swp target/kimhoanngan.jar root@209.97.173.193:/var/www/backend/

echo "Done!"
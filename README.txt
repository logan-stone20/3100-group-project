COMP 3100
Iteration 2
Team 5
Logan Stone (201500485), Zach Vaters (201727468), Hamzah Punjabi (201844933)


Set up steps required to run the server:

	- Our data set is contained in a .csv file called data.csv (included with submission). 
	  This data must be imported into a mongodb database. Here's how to do it:
		
		- Install mongodb data tools (https://docs.mongodb.com/database-tools/installation/installation/)
		- In your terminal, go into the installation location and open the bin folder (or alternatively add this location to your path variables)
		- Run the following command: mongoimport --db pollution-stats --collection pollution --type csv --headerline --file path\to\datafile\data.csv

		The "pollution-stats" database should now be initialized with the collection "pollution"

	- Run `npm install`

To run the app, run `node app` from the project root directory.

To run mocha tests, `npm run test` from the project root directory.
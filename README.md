# How to import data into mongodb

First, make sure your dataset is in csv format. (you can open excel and save it as a csv)

Install [mongodb data tools](https://docs.mongodb.com/database-tools/installation/installation/). Go into the installation location and open the bin folder (or alternatively add this location to your path variables). Run the following command:

`mongoimport --db pollution-stats --collection pollution --type csv --headerline --file path\to\datafile\data.csv`

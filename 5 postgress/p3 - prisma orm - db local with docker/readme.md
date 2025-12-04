docker run --name my-postgres -e POSTGRES_PASSWORD=mysecratepassword -d -p 5432:5432 postgres

//connection string 
"postgresql://postgres:mysecratepassword@localhost:5432/postgres"

// see using psql
// psql -h localhost -d postgres -U postgres
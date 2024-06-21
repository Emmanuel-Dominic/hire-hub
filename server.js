import createServer from "./routes/index";

const PORT = process.env.PORT || 3001;

const app = createServer();

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
